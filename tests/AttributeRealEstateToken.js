const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

describe("Real Estate Token contract", function () {

  async function issueRealEstateTokenFixture() {

    const [issuer, alice] = await ethers.getSigners();

    const issuerContract = await ethers.deployContract("Issuer");
    await issuerContract.waitForDeployment();
    
    const realEstateToken = await ethers.deployContract("RealEstateToken");
    await realEstateToken.waitForDeployment();


    return { issuerContract, realEstateToken, issuer, alice };
  }


  it("Should assign the total supply of the Real Estate Token to Alice", async function () {
    const { issuerContract, realEstateToken, issuer, alice } = await loadFixture(issueRealEstateTokenFixture);
    issuerContract.issue(alice.address, realEstateToken.totalSupply(), )
    

    const aliceBalance = await realEstateToken.balanceOf(alice.address);

    
    console.log(realEstateToken.totalSupply())
    expect(await realEstateToken.totalSupply()).to.equal(aliceBalance);

  });

});