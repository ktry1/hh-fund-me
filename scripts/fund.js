
const {getNamedAccounts, ethers} = require("hardhat");
async function main() {
  const deployer = await getNamedAccounts().deployer;
  const fundMe = await ethers.getContract("FundMe",deployer);
  console.log("Funding Contract...");
  const transactionResponse = await fundMe.fund({value:ethers.utils.parseEther("0.05")});
  await transactionResponse.wait(1);
  console.log(fundMe.address);
  console.log("Funded!");
}

main()
.then(()=>process.exit(0))
.catch((e)=>{
console.error(e);
process.exit(1);
});