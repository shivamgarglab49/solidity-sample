// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./base/IMyHederaTokenService.sol";
import "./base/IERC20.sol";
import "./base/Bits.sol";
import "./base/ITokenCreator.sol";
import "./h-contracts/HederaResponseCodes.sol";

contract TokenCreator is Initializable, ITokenCreator {
    // event name
    event SenderDetail(address indexed _from, string msg);

    // to using any solidy library
    using Bits for uint256;

    // for creating token
    IMyHederaTokenService private service;

    // created token reference
    IERC20 private token;

    function initialize(IMyHederaTokenService _ts)
        external
        payable
        override
        initializer
    {
        // init service
        service = _ts;
        // init token creation
        (, address createdTokenAddress) = createFungibleToken(0);
        // keeping cretaed token reference
        token = IERC20(createdTokenAddress);
    }

    function fetchBalanceOf(address account)
        external
        view
        override
        returns (int256)
    {
        require(address(token) > address(0x0), "token not created yet");
        return int256(token.balanceOf(account));
    }

    function fetchTokenAddress() external view override returns (address) {
        require(address(token) > address(0x0), "token not created yet");
        return address(token);
    }

    function fetchTokenCount() external view override returns (int256) {
        require(address(token) > address(0x0), "token not created yet");
        return int256(token.totalSupply());
    }

    function mintT(int256 count) external returns (int256 responseCode) {
        require(address(token) > address(0x0), "token not created yet");
        require(count > 0, "count must be > 0");
        (responseCode, ) = service.mintTokenP(address(token), count);
        require(
            responseCode == HederaResponseCodes.SUCCESS,
            "token minted failed."
        );
    }

    function assosiateT(address reciever)
        external
        returns (int256 responseCode)
    {
        require(address(token) > address(0x0), "token not created yet");
        require(address(reciever) > address(0x0), "receiver address error");
        responseCode = service.associateTokenP(reciever, address(token));
        require(
            responseCode == HederaResponseCodes.SUCCESS,
            "token assocation failed."
        );
    }

    function transferT(address reciever, int256 count)
        external
        returns (int256 responseCode)
    {
        require(address(token) > address(0x0), "token not created yet");
        require(address(reciever) > address(0x0), "receiver address error");
        require(count > 0, "count must be > 0");
        responseCode = service.transferTokenP(
            address(token),
            address(service),
            reciever,
            count
        );
        require(
            responseCode == HederaResponseCodes.SUCCESS,
            "token transferT failed."
        );
    }

    function allocateToken(address reciever, int256 count)
        external
        override
        returns (int256 responseCode)
    {
        require(address(token) > address(0x0), "token not created yet");
        require(count > 0, "count must be > 0");
        // step1- assosiate token
        int256 responsecode = service.associateTokenP(reciever, address(token));
        require(
            responsecode == HederaResponseCodes.SUCCESS,
            "token assocation failed."
        );
        // step2- mint token with given count
        (responsecode, ) = service.mintTokenP(address(token), count);
        require(
            responsecode == HederaResponseCodes.SUCCESS,
            "token minting failed."
        );
        // step3- transfer token with given count
        responsecode = service.transferTokenP(
            address(token),
            address(service),
            reciever,
            count
        );
        require(
            responsecode == HederaResponseCodes.SUCCESS,
            "token transfer failed."
        );
        return (responseCode);
    }

    function deallocateToken(address sender, int256 count)
        external
        override
        returns (int256 responseCode)
    {
        require(count > 0, "count must be > 0");
        require(
            this.fetchBalanceOf(sender) >= count,
            "user don't have enough count"
        );
        // step1- transfer token with given count
        int256 responsecode = service.transferTokenP(
            address(token),
            sender,
            address(service),
            count
        );
        require(
            responsecode == HederaResponseCodes.SUCCESS,
            "token transfer failed."
        );
        // step2- burn token with given count
        (responsecode, ) = service.burnTokenP(address(token), count);
        require(
            responsecode == HederaResponseCodes.SUCCESS,
            "token burn failed."
        );
        return (responseCode);
    }

    function createFungibleToken(int256 inititalSupply)
        private
        returns (int256 responseCode, address tokenAddress)
    {
        // we are using contract address as treasury
        address treasury = address(service);

        uint256 supplyKeyType;
        IHederaTokenService.KeyValue memory supplyKeyValue;

        supplyKeyType = supplyKeyType.setBit(4);
        supplyKeyValue.delegatableContractId = treasury;

        IHederaTokenService.TokenKey[]
            memory keys = new IHederaTokenService.TokenKey[](1);
        keys[0] = IHederaTokenService.TokenKey(supplyKeyType, supplyKeyValue);

        IHederaTokenService.Expiry memory expiry;
        expiry.autoRenewAccount = treasury;
        expiry.autoRenewPeriod = 8000000;

        IHederaTokenService.HederaToken memory myToken;
        myToken.name = "Hard";
        myToken.symbol = "H1";
        myToken.treasury = treasury;
        // create the expiry schedule for the token using ExpiryHelper
        myToken.expiry = expiry;
        myToken.tokenKeys = keys;

        (bool success, bytes memory result) = address(service).call{
            value: msg.value
        }(
            abi.encodeWithSelector(
                IMyHederaTokenService.createFungibleTokenP.selector,
                myToken,
                inititalSupply,
                0
            )
        );

        (responseCode, tokenAddress) = success
            ? abi.decode(result, (int256, address))
            : (int256(HederaResponseCodes.UNKNOWN), address(0x0));

        require(
            responseCode == HederaResponseCodes.SUCCESS,
            "token creation failed."
        );
    }
}
