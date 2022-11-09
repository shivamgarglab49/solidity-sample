import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

//adds Ethereum-specific capabilities to the Chai assertion library,
//making your smart contract tests easy to write and read.
//FMI => https://hardhat.org/hardhat-chai-matchers/docs/overview
import "@nomicfoundation/hardhat-chai-matchers";

//This plugin brings to Hardhat the Ethereum library ethers.js,
//which allows you to interact with the Ethereum / any blockchain in a simple way.
//For now, we are using it into test module
//FMI => https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers
import "@nomiclabs/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
