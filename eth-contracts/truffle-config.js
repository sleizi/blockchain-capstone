const HDWalletProvider = require('truffle-hdwallet-provider');

const fs = require('fs');
const infuraKey = fs.readFileSync(".rinkeby-infurakey").toString().trim();
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // rinkeby's id
      gas: 4500000,        // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000
    },
  },

  mocha: {
    timeout: 10000000
  },

  compilers: {
    solc: {
      version: "^0.5.5",
    }
  }

}
