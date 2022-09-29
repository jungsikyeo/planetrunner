var Web3 = require('web3');
var PlanetRunners = artifacts.require('PlanetRunners');
var Marketplace = artifacts.require('Marketplace');

async function logNftLists(marketplace) {
  let listedNfts = await marketplace.getListedNfts.call();
  const accountAddress = '0xd1dB94235d312a7Cebb7346eFa6BF6fB98a0fD52';
  let myNfts = await marketplace.getMyNfts.call({ from: accountAddress });
  let myListedNfts = await marketplace.getMyListedNfts.call({
    from: accountAddress
  });
  console.log(`listedNfts: ${listedNfts.length}`);
  console.log(`myNfts: ${myNfts.length}`);
  console.log(`myListedNfts ${myListedNfts.length}\n`);
}

const main = async cb => {
  try {
    const planetRunner = await PlanetRunners.deployed();
    const marketplace = await Marketplace.deployed();
    const secondAddress = '0x3CC90eBAA6c51c6aC38d10DeA5f1831fdd6d7b22';

    console.log('MINT AND LIST 3 NFTs');
    let listingFee = await marketplace.getListingFee();
    listingFee = listingFee.toString();
    let txn1 = await planetRunner.mint(
      'ipfs://bafybeigtohdkrndj7jghq3yligoiqnvsz4vsmwfpga7ri7hgp6e2klzs7m/0.json'
    );
    let tokenId1 = txn1.logs[2].args[0].toNumber();
    await marketplace.listNft(
      planetRunner.address,
      tokenId1,
      Web3.utils.toWei('1', 'ether'),
      {
        value: listingFee
      }
    );
    console.log(`Minted and listed ${tokenId1}`);
    let txn2 = await planetRunner.mint(
      'ipfs://bafybeigtohdkrndj7jghq3yligoiqnvsz4vsmwfpga7ri7hgp6e2klzs7m/1.json'
    );
    let tokenId2 = txn2.logs[2].args[0].toNumber();
    await marketplace.listNft(
      planetRunner.address,
      tokenId2,
      Web3.utils.toWei('1', 'ether'),
      {
        value: listingFee
      }
    );
    console.log(`Minted and listed ${tokenId2}`);
    let txn3 = await planetRunner.mint(
      'ipfs://bafybeigtohdkrndj7jghq3yligoiqnvsz4vsmwfpga7ri7hgp6e2klzs7m/2.json'
    );
    let tokenId3 = txn3.logs[2].args[0].toNumber();
    await marketplace.listNft(
      planetRunner.address,
      tokenId3,
      Web3.utils.toWei('1', 'ether'),
      {
        value: listingFee
      }
    );
    console.log(`Minted and listed ${tokenId3}`);
    await logNftLists(marketplace);

    console.log('BUY 2 NFTs');
    await marketplace.buyNft(planetRunner.address, tokenId1, {
      value: Web3.utils.toWei('1.2', 'ether')
    });
    await marketplace.buyNft(planetRunner.address, tokenId2, {
      value: Web3.utils.toWei('1.5', 'ether'),
      from: secondAddress
    });
    await logNftLists(marketplace);

    const token2 = await marketplace.getNft(tokenId2);
    console.log('market: token2 Owner:', token2);

    const token2Owner = await planetRunner.ownerOf(tokenId2);
    console.log('planet:token2Owner:', token2Owner);

    console.log('RESELL 1 NFT');
    await marketplace.listNft(
      planetRunner.address,
      tokenId2,
      Web3.utils.toWei('2', 'ether'),
      {
        value: listingFee,
        from: secondAddress
      }
    );
    await logNftLists(marketplace);
  } catch (err) {
    console.log('Doh! ', err);
  }
  cb();
};

module.exports = main;
