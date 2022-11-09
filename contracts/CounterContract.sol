// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// below import required, so compiler can generate TransparentUpgradeableProxy.json
// or we need to pick json from build folder of openzeppelin
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract CounterContract is Initializable {
    uint256 public counter;

    function initialize(uint256 _counter) public initializer {
        counter = _counter;
    }

    function decrement() public {
        counter = counter - 1;
    }

    function increment() public {
        counter = counter + 1;
    }
}
