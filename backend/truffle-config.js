module.exports = {
  networks: {
    development: {
      host: '144.24.70.230', // Localhost (default: none)
      port: '8555', // Standard Ethereum port (default: none)
      network_id: '*' // Any network (default: none)
    }
  },

  contracts_directory: './contracts/',
  contracts_build_directory: './abis',

  // Configure your compilers
  compilers: {
    solc: {
      version: '^0.8.7', // Fetch exact version from solc-bin
      optimizer: {
        enabled: 'true',
        runs: 200
      }
    }
  }
};
