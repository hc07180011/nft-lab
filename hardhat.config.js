/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, API_URL_MATIC, PRIVATE_KEY, PUBLIC_KEY } = process.env;
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.3",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.8.1",
      },
    ],
  },
  defaultNetwork: "matic",
  networks: {
    hardhat: {},
    ropsten: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    matic: {
      url: API_URL_MATIC,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}
