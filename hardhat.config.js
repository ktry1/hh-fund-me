require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require('hardhat-deploy');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const RINKEBY_ACCOUNT1 = process.env.RINKEBY_PRIVATE_KEY1;
module.exports = {
  solidity:{
    compilers:[{version:"0.8.7"},
    {version: "0.6.6"}]
},

  defaultNetwork:"hardhat",
  networks: {
    rinkeby :{
      chainId:4,
      url: process.env.ALCHEMY_RINKEBY_URL,
      accounts: [RINKEBY_ACCOUNT1],
      gas: 2300000,
        
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    noColors:true,
    coinmarketcap:process.env.COINMARKETCAP_API_KEY, 
    token: "ETH",
    outputFile: "gas_report.txt"
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_RINKEBY_API_KEY,
    }
  },
  namedAccounts : {
    deployer:{
      default:0,
      4:0,
    },
    user: {
      default:1,
    }
  },
};
