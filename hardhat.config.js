require("@nomicfoundation/hardhat-toolbox");

// Ensure your configuration variables are set before executing the script
const { vars } = require("hardhat/config");

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and add it to the configuration variables
const PRIVATE_KEY_FUJI = vars.get("PRIVATE_KEY_FUJI");

// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

const API_URL = vars.get("API_URL");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {

    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.formatEther(balance), "ETH");
  });

module.exports = {
  solidity : {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [PRIVATE_KEY_FUJI],
    },  
    sepolia: {
      url: API_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};