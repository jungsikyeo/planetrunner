// var PlanetRunners = artifacts.require('PlanetRunners');
// var Marketplace = artifacts.require('Marketplace');

// module.exports = async function (deployer) {
//   await deployer.deploy(Marketplace);
//   const marketplace = await Marketplace.deployed();
//   await deployer.deploy(PlanetRunners, marketplace.address);
// };

var PlanetRunners = artifacts.require('NFT');
var Marketplace = artifacts.require('Market');

module.exports = async function (deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(PlanetRunners, marketplace.address);
};
