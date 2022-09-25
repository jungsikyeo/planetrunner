const PlanetRunners = artifacts.require('PlanetRunners');

module.exports = function (deployer) {
  deployer.deploy(PlanetRunners);
};
