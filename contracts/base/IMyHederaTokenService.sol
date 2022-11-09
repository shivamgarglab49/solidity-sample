// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "../h-contracts/IHederaTokenService.sol";

interface IMyHederaTokenService {
    function associateTokensP(address account, address[] memory tokens)
        external
        returns (int256 responseCode);

    function associateTokenP(address account, address token)
        external
        returns (int256 responseCode);

    function mintTokenP(address token, int256 amount)
        external
        returns (int256 responseCode, int256 newTotalSupply);

    function transferTokenP(
        address token,
        address sender,
        address recipient,
        int256 amount
    ) external returns (int256 responseCode);

    function burnTokenP(address token, int256 amount)
        external
        returns (int256 responseCode, int256 newTotalSupply);

    function createFungibleTokenP(
        IHederaTokenService.HederaToken memory token,
        uint256 initialTotalSupply,
        uint32 decimals
    ) external payable returns (int256 responseCode, address tokenAddress);
}
