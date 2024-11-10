
const hre = require("hardhat");

const realEstateTokenAddress = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"
const deutchAuctionAddress = "0x2d1D0263174C3801C7F408154F883baD64E5b9d1"
const sellerAddress = "0xbD9338b1957FC9bc9e5FDe60d5a2E26F86c344F9"
/*const tokenId = ""
const data = 
const amount = 
const initialPrice = 
const decrementStep = 
const reservePrice = 
*/ // TODO

async function main() {
  const deutchAuctionContract = await hre.ethers.getContractAt("DeutchAuction", deutchAuctionAddress);

  const automatedForwarderTx = await deutchAuctionContract.startAuction()
  console.log("Transaction hash:", automatedForwarderTx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });