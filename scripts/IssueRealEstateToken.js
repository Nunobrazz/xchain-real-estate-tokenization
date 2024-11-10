
const hre = require("hardhat");

const issuerAddress = "0xe851C3BBe435584c835FA14ac3985B2A3c9c7700"

//const realEstateTokenAddress = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"
const to = "0xbD9338b1957FC9bc9e5FDe60d5a2E26F86c344F9" 
const amount = 20
const subscriptionId = 13115 // associated to metamask wallet
const gasLimit = 300000
const donID = "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000"


async function main() {
  const issuerContract = await hre.ethers.getContractAt("Issuer", issuerAddress);
  try{
    const issueTx = await issuerContract.issue(to, amount, subscriptionId, gasLimit, donID)
    console.log("Issue Transaction hash:", issueTx.hash);
  }catch(error){
    if (error.code == 3){
      console.log("Canceling Pending Request...");
      const cancelTx = await issuerContract.cancelPendingRequest()
      console.log("Cancel Transaction Hash:", cancelTx.hash);
      console.log("Trying again...");
      const issueTx = await issuerContract.issue(to, amount, subscriptionId, gasLimit, donID)
      console.log("Issue Transaction hash:", issueTx.hash);
    }
    else{
      console.log(error.code)
    }
  }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


