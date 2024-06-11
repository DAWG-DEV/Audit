// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeToken is ERC20, Ownable{
    constructor(uint256 initialSupply, string memory name, string memory symbol,address owner)  ERC20(name, symbol) Ownable(owner){
        _mint(owner, initialSupply);
    }
}
