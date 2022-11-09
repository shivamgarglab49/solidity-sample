// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

library Bits {
    uint256 internal constant ONE = uint256(1);

    function setBit(uint256 self, uint8 index) internal pure returns (uint256) {
        return self | (ONE << index);
    }
}
