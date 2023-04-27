const { TruffleProvider } = require('@trufflesuite/web3-provider-engine');
const { OKT_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    okt: {
      provider: () => {
        return new TruffleProvider(OKT_RPC_URL, PRIVATE_KEY);
      },
      network_id: '*', // Match any network id
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.1", // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};