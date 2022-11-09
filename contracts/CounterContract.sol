// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CounterContract {
    uint256 public counter;

    function decrement() public {
        counter = counter - 1;
    }

    function increment() public {
        counter = counter + 1;
    }
}
