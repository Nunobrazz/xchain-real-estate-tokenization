const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


// 0x2d1D0263174C3801C7F408154F883baD64E5b9d1
const network = 'fuji';

const realEstateAddressFuji = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"


module.exports = buildModule("Bootcamp", (m) => {

  if (network == 'fuji'){    
    const ret = m.contract("DeutchAuction", [realEstateAddressFuji]);
    return { ret };
  }

  else if (network == 'sepolia'){
    const ret = m.contract("DeutchAuction", []);
    return { ret };

  }
});