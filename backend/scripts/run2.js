var Web3 = require('web3');
var PlanetRunners = artifacts.require('NFT');
var Marketplace = artifacts.require('Market');

const main = async cb => {
  try {
    const planetRunner = await PlanetRunners.deployed();
    const marketplace = await Marketplace.deployed();
    const firstAddress = '0xe00Ce43643cd78a885a0A04e00Df60A4e962784b';
    const secondAddress = '0xd1dB94235d312a7Cebb7346eFa6BF6fB98a0fD52';
    const thirdAddress = '0x3CC90eBAA6c51c6aC38d10DeA5f1831fdd6d7b22';

    console.log('MINT AND LIST 3 NFTs');
    let listingFee = await marketplace.getListingPrice();
    listingFee = listingFee.toString();
    let txn1 = await planetRunner.createToken({
      from: firstAddress
    });
    console.log('txn1:', txn1);

    let tokenId1 = 1;
    await marketplace.createMarketItem(
      planetRunner.address,
      tokenId1,
      Web3.utils.toWei('1', 'ether'),
      {
        value: listingFee
      }
    );
    console.log(`Minted and listed ${tokenId1}`);
    let txn2 = await planetRunner.createToken({
      from: firstAddress
    });
    console.log('txn2:', txn2);

    let tokenId2 = 2;
    await marketplace.createMarketItem(
      planetRunner.address,
      tokenId2,
      Web3.utils.toWei('2.2', 'ether'),
      {
        value: listingFee
      }
    );
    console.log(`Minted and listed ${tokenId2}`);
    let txn3 = await planetRunner.createToken({
      from: firstAddress
    });
    console.log('txn3:', txn3);

    let tokenId3 = 3;
    await marketplace.createMarketItem(
      planetRunner.address,
      tokenId3,
      Web3.utils.toWei('3.5', 'ether'),
      {
        value: listingFee
      }
    );
    console.log(`Minted and listed ${tokenId3}`);

    console.log('BUY 2 NFTs');
    await marketplace.createMarketSale(planetRunner.address, tokenId1, {
      value: Web3.utils.toWei('1', 'ether')
    });
    await marketplace.createMarketSale(planetRunner.address, tokenId2, {
      value: Web3.utils.toWei('2.2', 'ether'),
      from: secondAddress
    });

    const token2 = await marketplace.fetchSingleItem(tokenId2);
    console.log('market: token2 Owner:', token2);

    console.log('RESELL 1 NFT');
    await marketplace.putItemToResell(
      planetRunner.address,
      tokenId2,
      Web3.utils.toWei('2.5', 'ether'),
      {
        value: listingFee,
        from: secondAddress
      }
    );

    console.log('market: token1:', await marketplace.fetchSingleItem(tokenId1));
    console.log('market: token2:', await marketplace.fetchSingleItem(tokenId2));
    console.log('market: token3:', await marketplace.fetchSingleItem(tokenId3));
  } catch (err) {
    console.log('Doh! ', err);
  }
  cb();
};

module.exports = main;
