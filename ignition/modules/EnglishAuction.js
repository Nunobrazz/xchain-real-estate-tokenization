const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// 0x91F2c5685dAE2C406aDf1E6095adE5Ad12C67D71


const network = 'fuji';

const fractionalizedRealEstateAddressFuji = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"

module.exports = buildModule("Bootcamp", (m) => {

  if (network == 'fuji'){    
    const ret = m.contract("EnglishAuction", [fractionalizedRealEstateAddressFuji]);
    return { ret };
  }

  else if (network == 'sepolia'){
    const ret = m.contract("EnglishAuction", []);
    return { ret };

  }
});