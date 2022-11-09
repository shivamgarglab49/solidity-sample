// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TestContract {
    // events
    event UserNameUpdated(string userName);
    event UserNameUpdatedWithCount(string userName, int count);
    event UserNameRead();

    // proprties
    string private userName;

    // non argument constructor
    constructor() {}

    function setName(string memory newUserName) public {
        require(bytes(newUserName).length != 0, "newUserName can not be empty");
        userName = newUserName;
    }

    function setUserName(string memory newUserName) public {
        userName = newUserName;
        emit UserNameUpdated(userName);
    }

    function setUserNameWithCount(string memory newUserName, int count) public {
        userName = newUserName;
        emit UserNameUpdatedWithCount(userName, count);
    }

    function getUserName() public {
        emit UserNameRead();
    }

    function getNumber10() public pure returns (uint) {
        return 10;
    }
}
