const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const network = 'fuji';

const realEstateTokenAddressFuji = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"
const functionsRouterAddressFuji = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0"


module.exports = buildModule("Bootcamp", (m) => {
  
  if (network == 'fuji'){    
    const ret = m.contract("Issuer", [realEstateTokenAddressFuji, functionsRouterAddressFuji]);
    return { ret };

  }
  else if (network == 'sepolia'){
    const ret = m.contract("Issuer", ["", "", "", "", ""]);
    return { ret };
  }
});