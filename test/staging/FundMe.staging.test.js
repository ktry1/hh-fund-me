const { expect, assert, use } = require("chai");
const { parseBytes32String } = require("ethers/lib/utils");
const {deployments, ethers, getNamedAccounts, network} = require("hardhat");
const {developmentChains} = require("../../helper-hardhat-config");


if (developmentChains.includes(network.name)) { describe.skip}
else{
describe("FundMe", async function(){
    let fundMe;
    let deployer;
    const sendValue = ethers.utils.parseEther("0.0001");
    
    beforeEach(async function(){
    deployer = (await getNamedAccounts()).deployer;
    fundMe = await ethers.getContract("FundMe", deployer);
});
    it("Allows people to fund and withdraw", async function(){
        await fundMe.fund({value:sendValue});
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(),"0");
    })
});
}