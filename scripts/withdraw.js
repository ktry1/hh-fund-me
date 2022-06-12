
const {getNamedAccounts, ethers} = require("hardhat");
async function main() {
  const deployer = await getNamedAccounts().deployer;
  const fundMe = await ethers.getContract("FundMe",deployer);
  console.log("Withdrawal commencing...");
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log(fundMe.address);
  console.log("Withdrawal Successful!");
}

main()
.then(()=>process.exit(0))
.catch((e)=>{
console.error(e);
process.exit(1);
});