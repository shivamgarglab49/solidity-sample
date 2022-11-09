// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "./IMyHederaTokenService.sol";

interface ITokenCreator {
    /**
     * token service to run all functionality
     */
    function initialize(IMyHederaTokenService _ts) external payable;

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function fetchBalanceOf(address account) external view returns (int256);

    /**
     * @dev Returns the address of token.
     */
    function fetchTokenAddress() external view returns (address);

    /**
     * @dev Returns the token count.
     */
    function fetchTokenCount() external view returns (int256);

    /**
     * @dev allotocate token
     */
    function allocateToken(address reciever, int256 count)
        external
        returns (int256 responseCode);

    /**
     * @dev deallocateToken token
     */
    function deallocateToken(address sender, int256 count)
        external
        returns (int256 responseCode);
}
