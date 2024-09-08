require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");


// Environment variable setup
const RSK_TESTNET_RPC_URL = process.env.RSK_TESTNET_RPC_URL;
const HEDERA_TESTNET_RPC_URL = process.env.HEDERA_TESTNET_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
    },

    rskTestnet: {
      url: RSK_TESTNET_RPC_URL,
      chainId: 31,
      gasPrice: 60000000,
      accounts: [PRIVATE_KEY],
    },
    
    hederaTestnet: {
      url: HEDERA_TESTNET_RPC_URL,
      chainId: 296,
      gasPrice: 60000000,
      accounts: [PRIVATE_KEY],
    }
  },
};
