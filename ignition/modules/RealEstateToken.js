const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const network = 'fuji';

module.exports = buildModule("Bootcamp", (m) => {

  if (network == 'fuji'){    
    const ret = m.contract("RealEstateToken", ["", "0xF694E193200268f9a4868e4Aa017A0118C9a8177", "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846", "14767482510784806043", "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0"]);
    return { ret };

  }
  else if (network == 'sepolia'){
    const ret = m.contract("RealEstateToken", ["", "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x779877A7B0D9E8603169DdbD7836e478b4624789", "16015286601757825753", "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0"]);
    return { ret };

  }
});