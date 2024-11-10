
const hre = require("hardhat");

const realEstateTokenAddress = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"
const issuerAddress = "0xe851C3BBe435584c835FA14ac3985B2A3c9c7700"
async function main() {
  const retContract = await hre.ethers.getContractAt("RealEstateToken", realEstateTokenAddress);
  const setIssueTx = await retContract.setIssuer(issuerAddress)
  console.log("Transaction hash:", setIssueTx.hash);
  console.log("Transaction data:", setIssueTx.data);
  console.log("Transaction:", setIssueTx);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });