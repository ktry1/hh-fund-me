const { expect, assert, use } = require("chai");
const { parseBytes32String } = require("ethers/lib/utils");

const {deployments, ethers, getNamedAccounts, network} = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
let mockV3Aggregator;
let deployer;
let user;
let fundMe;
const sendValue = ethers.utils.parseEther("1");
!developmentChains.includes(network.name) ?
describe.skip
:describe("FundMe", function () {
    beforeEach(async function(){
        accounts = await getNamedAccounts();
        deployer = accounts.deployer;
        user = accounts.user;
        

        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe",deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer);
        deployer = await ethers.getSigner(deployer);
    });
    describe("Constructor", function () {
    it("Sets the aggregator address correctly", async function () {
        response = await fundMe.s_priceFeed();
        assert.equal(response, mockV3Aggregator.address)
    });
    it("fallback should call fund()", async function(){
        const eth_amount = "2.5";
        const transactionHash = await deployer.sendTransaction({
            to: fundMe.address,
            value: ethers.utils.parseEther(eth_amount), // Sends exactly 1.0 ether
        });
        deployer_balance = await fundMe.getAddressToAmountFunded(deployer.address);
        deployer_balance = await deployer_balance.toString();
        assert.equal(deployer_balance,eth_amount.replace(".", '')+"00000000000000000");
    });
    });
    describe("Fund", function () {
        it("Fail, if not enough Eth was sent", async function(){
            await expect(fundMe.fund()).to.be.revertedWith("FundMe__NotEnoughMoney()");
        });
        it("Updates fund amount data structure",async function(){
            user = await ethers.getSigner(user);
            await fundMe.connect(user).fund({value:sendValue});

            response =await fundMe.getAddressToAmountFunded(user.address);
            assert.equal(response.toString(),sendValue.toString());
        });
        
    });
    describe("Withdraw", async function(){
        beforeEach(async function(){
            user = await ethers.getSigner(user);
            await fundMe.connect(user).fund({value:sendValue});
        });
        it("Must withdraw funds from contract",async function(){
        const startingContractBalance = await fundMe.provider.getBalance(fundMe.address);
        console.log(`Starting contract balance is: ${startingContractBalance.toString()} Wei`);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);
        console.log(`Starting owner balance is: ${startingDeployerBalance.toString()} Wei`);
        console.log("Owner is withdrawing funds..")
        const transactionResponse = await fundMe.connect(deployer).withdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        const {gasUsed, effectiveGasPrice} = transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);
        const afterWithdrawContractBalance = await fundMe.provider.getBalance(fundMe.address);
        console.log(`Updated contract balance is: ${afterWithdrawContractBalance.toString()} Wei`);
        const afterWithdrawOwnerBalance = await fundMe.provider.getBalance(deployer.address);
        console.log(`Updated owner balance is: ${afterWithdrawOwnerBalance.toString()} Wei`);
        assert.equal(afterWithdrawContractBalance,0);
        assert.equal(startingContractBalance.add(startingDeployerBalance).toString(),
        afterWithdrawOwnerBalance.add(gasCost).toString())
    });
    it("Must reject withdraw() if called not by the owner", async function(){
        await expect(fundMe.connect(user).withdraw()).to.be.revertedWith("FundMe__NotOwner()");
    });
    it("Must withdraw with multiple getFunder", async function(){
        const accounts = await ethers.getSigners();
        const startingContractBalance = await fundMe.provider.getBalance(fundMe.address);
        console.log(`starting fundMe Balance is ${startingContractBalance} wei`);

        for (let i = 0; i <accounts.length; i++){
            connectedFundMe = await fundMe.connect(accounts[i]);
            transactionResponse = await connectedFundMe.fund({value:sendValue});
            transactionReceipt = await transactionResponse.wait(1);
        };
        await fundMe.withdraw();
        for (let i = 0; i <accounts.length; i++){
            user_balance =await fundMe.getAddressToAmountFunded(accounts[i].address)
            console.log(`user${i+1} balance is ${user_balance}`)
            assert(user_balance,0)
        }
    });

    });
    describe("Cheaper Withdraw testing...", async function(){
        beforeEach(async function(){
            user = await ethers.getSigner(user);
            await fundMe.connect(user).fund({value:sendValue});
        });
        it("Must withdraw funds from contract",async function(){
        const startingContractBalance = await fundMe.provider.getBalance(fundMe.address);
        console.log(`Starting contract balance is: ${startingContractBalance.toString()} Wei`);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);
        console.log(`Starting owner balance is: ${startingDeployerBalance.toString()} Wei`);
        console.log("Owner is withdrawing funds..")
        const transactionResponse = await fundMe.connect(deployer).cheaperWithdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        const {gasUsed, effectiveGasPrice} = transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);
        const afterWithdrawContractBalance = await fundMe.provider.getBalance(fundMe.address);
        console.log(`Updated contract balance is: ${afterWithdrawContractBalance.toString()} Wei`);
        const afterWithdrawOwnerBalance = await fundMe.provider.getBalance(deployer.address);
        console.log(`Updated owner balance is: ${afterWithdrawOwnerBalance.toString()} Wei`);
        assert.equal(afterWithdrawContractBalance,0);
        assert.equal(startingContractBalance.add(startingDeployerBalance).toString(),
        afterWithdrawOwnerBalance.add(gasCost).toString())
    });
    it("Must reject withdraw() if called not by the owner", async function(){
        await expect(fundMe.connect(user).cheaperWithdraw()).to.be.revertedWith("FundMe__NotOwner()");
    });
    it("Must withdraw with multiple getFunder", async function(){
        const accounts = await ethers.getSigners();
        const startingContractBalance = await fundMe.provider.getBalance(fundMe.address);
        console.log(`starting fundMe Balance is ${startingContractBalance} wei`);

        for (let i = 0; i <accounts.length; i++){
            connectedFundMe = await fundMe.connect(accounts[i]);
            transactionResponse = await connectedFundMe.fund({value:sendValue});
            transactionReceipt = await transactionResponse.wait(1);
        };
        await fundMe.cheaperWithdraw();
        for (let i = 0; i <accounts.length; i++){
            user_balance =await fundMe.getAddressToAmountFunded(accounts[i].address)
            console.log(`user${i+1} balance is ${user_balance}`)
            assert(user_balance,0)
        }
    });

    });
  });