
const hre = require("hardhat");

const realEstateTokenAddress = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"
async function main() {
  const retContract = await hre.ethers.getContractAt("RealEstateToken", realEstateTokenAddress);
  const automatedForwarderTx = await retContract.setAutomationForwarder("0x819B58A646CDd8289275A87653a2aA4902b14fe6")
  console.log("Transaction hash:", automatedForwarderTx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });