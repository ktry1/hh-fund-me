const { run } = require("hardhat");

const verify = async (contractAdress,args) =>{
    console.log("Verifying contract..");
    try {
        await run("verify:verify",{
            address: contractAdress,
            constructorArguments: args,
        })
    } catch (e){
        if (e.message.toLowerCase().includes("already verified")){
            console.log("Contract was already verified!")
        }
            else {
            console.log(e);
        };
        
    }
}
module.exports = {verify};