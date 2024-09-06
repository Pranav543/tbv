const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("TBVProtocolModule", (m) => {


  const tbv = m.contract("TBVProtocol");

  return { tbv };
});
