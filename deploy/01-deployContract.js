const {network} = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify");


module.exports = async ({getNamedAccounts,deployments})=>{
  const {deploy,log} = deployments;
    const {deployer,user} = await getNamedAccounts();
    chainId = network.config.chainId;
    
    let ethUsdchainAddress;
    let args;
    let contract;

    
    async function FundMe () {
      contract = await deploy('FundMe', {
      from: deployer,
      args: args ,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1, 
    });
    console.log("deployed!");
  };

if (developmentChains.includes(network.name)){
  const ethUsdAggregator  = await deployments.get("MockV3Aggregator");
  ethUsdchainAddress = ethUsdAggregator.address;
  args = [ethUsdchainAddress];
  await FundMe();
 
}else{
  ethUsdchainAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  args = [ethUsdchainAddress];
  await FundMe();

  await verify(contract.address,args);
  console.log(contract.address);
};
};

  
module.exports.tags = ["all","fundme"];
