require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
};
require('hardhat-abi-exporter')
require('dotenv').config()

const { DEPLOYER_PRIVATE_KEY, USER_PRIVATE_KEY, CHAIN_NAME ,RPC_ENDPOINT} = process.env
 
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: CHAIN_NAME,
  networks: {
    local: {
      url: RPC_ENDPOINT,
      accounts: [DEPLOYER_PRIVATE_KEY,USER_PRIVATE_KEY],
    },
    sepolia: {
      url: RPC_ENDPOINT,
      accounts: [DEPLOYER_PRIVATE_KEY,USER_PRIVATE_KEY],
    },
    balst_test: {
      url: RPC_ENDPOINT,
      accounts: [DEPLOYER_PRIVATE_KEY,USER_PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          viaIR :true,
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
        
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.24',
        settings: {  
        
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 20000,
          },
        },
      },
    ],
  },
 
  abiExporter: {
    path: `./package/abi`,
    clear: true,
    flat: true,
    only: ["AggregatedSwapRouter","MyDefiSwapCore","BaseChainQueryUtil"],
    spacing: 2,
    format: 'json',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
}
