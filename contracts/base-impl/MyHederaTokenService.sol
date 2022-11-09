// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "../base/IMyHederaTokenService.sol";
import "../h-contracts/HederaTokenService.sol";
import "../h-contracts/HederaResponseCodes.sol";

contract MyHederaTokenService is HederaTokenService, IMyHederaTokenService {
    // event info
    event SenderInfo(address _from, string tag);

    function transferTokenP(
        address token,
        address sender,
        address recipient,
        int256 amount
    ) external override returns (int256 responseCode) {
        responseCode = HederaTokenService.transferToken(
            token,
            sender,
            recipient,
            int64(amount)
        );
        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("transfer token failed.");
        }
    }

    function associateTokensP(address account, address[] memory tokens)
        external
        override
        returns (int256 responseCode)
    {
        responseCode = HederaTokenService.associateTokens(account, tokens);
        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("assocation tokens failed.");
        }
    }

    function associateTokenP(address account, address token)
        external
        override
        returns (int256 responseCode)
    {
        responseCode = HederaTokenService.associateToken(account, token);
        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("assocation token failed.");
        }
    }

    function mintTokenP(address token, int256 amount)
        external
        override
        returns (int256 responseCode, int256 newTotalSupply)
    {
        emit SenderInfo(msg.sender, "mintTokenP");
        bytes[] memory metadata;
        (
            int256 responseCodeNew,
            uint64 newTotalSupplyNew,

        ) = HederaTokenService.mintToken(
                token,
                uint64(uint256(amount)),
                metadata
            );
        if (responseCodeNew != HederaResponseCodes.SUCCESS) {
            revert("mint token failed.");
        }
        return (responseCodeNew, int256(int64(newTotalSupplyNew)));
    }

    function burnTokenP(address token, int256 amount)
        external
        override
        returns (int256 responseCode, int256 newTotalSupply)
    {
        int64[] memory serialNumbers;
        (int256 code, uint64 supply) = HederaTokenService.burnToken(
            token,
            uint64(uint256(amount)),
            serialNumbers
        );
        if (code != HederaResponseCodes.SUCCESS) {
            revert("burn token failed.");
        }
        return (code, int256(int64(supply)));
    }

    function createFungibleTokenP(
        IHederaTokenService.HederaToken memory token,
        uint256 initialTotalSupply,
        uint32 decimals
    )
        external
        payable
        override
        returns (int256 responseCode, address tokenAddress)
    {
        emit SenderInfo(msg.sender, "createFungibleTokenP");
        (responseCode, tokenAddress) = HederaTokenService.createFungibleToken(
            token,
            uint64(initialTotalSupply),
            decimals
        );

        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("createFungibleToken failed");
        }
    }
}
