const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const network = 'fuji';

const realEstateTokenAddressFuji = "0x119c6715ea6EbDDA4F32e3bBDA2ffEDa13F35d4e"
const usdcFuji = "0x5425890298aed601595a70ab815c96711a31bc65"
const usdcUsdAggregatorAddressFuji = "0x97FE42a7E96640D932bbc0e1580c73E705A8EB73"
const usdcUsdHeartBeatFuji = 86400

const RWALendingFuji = "0xc72e1978421dDEC8425aC773e21A2AB34d6a0648"

const realEstateTokenAddressSepolia = ""
const usdcSepolia = ""
const usdcUsdAggregatorAddressSepolia = ""
const usdcUsdHeartBeatSepolia = 86400



module.exports = buildModule("Bootcamp", (m) => {
  
  if (network == 'fuji'){    
    const ret = m.contract("RwaLending", [realEstateTokenAddressFuji, usdcFuji, usdcUsdAggregatorAddressFuji, usdcUsdHeartBeatFuji]);
    return { ret };

  }
  else if (network == 'sepolia'){
    const ret = m.contract("RwaLending", ["", "", "", "", ""]);
    return { ret };
  }
});