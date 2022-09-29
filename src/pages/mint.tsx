import { NextPage } from 'next';
import { useState } from 'react';
import { Button, message } from 'antd';
import { IWindow, MintType } from '@libs/client/client';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Marketplace from '@abis/Market.json';
import PlanetRunners from '@abis/NFT.json';

const Mint: NextPage<MintType> = ({ planetRunnerContract }: MintType) => {
  const [isLogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState('');
  const [supply, setSupply] = useState({
    mintCount: 0,
    totalCount: 100
  });

  const getSupply = async () => {
    const mintCount = await planetRunnerContract.methods.currentSupply().call();
    const totalCount = await planetRunnerContract.methods.MAX_SUPPLY().call();

    setSupply({
      mintCount: Number(mintCount),
      totalCount: Number(totalCount)
    });

    return {
      mintCount: Number(mintCount),
      totalCount: Number(totalCount)
    };
  };

  const connection = async () => {
    try {
      const ethereum: IWindow['ethereum'] = (window as any).ethereum;
      if (!ethereum) {
        message.error('Metamask not detected');
        return false;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsLogin(true);
      }
      getSupply();
    } catch (e) {
      message.error('An unexpected problem has occurred.');
      console.log(e);
      return false;
    }
  };

  const mintNFT = async () => {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();

    // Mint the NFT
    const planetRunnerAddress = (PlanetRunners as any).networks[networkId]
      .address;
    const planetRunnerContract = new web3.eth.Contract(
      (PlanetRunners as any).abi,
      planetRunnerAddress
    );
    const marketPlaceContract = new web3.eth.Contract(
      (Marketplace as any).abi,
      (Marketplace as any).networks[networkId].address
    );

    const mintCount = await planetRunnerContract.methods.currentSupply().call();
    const totalCount = await planetRunnerContract.methods.MAX_SUPPLY().call();

    console.log(mintCount, totalCount);

    if (Number(mintCount) < Number(totalCount)) {
      let listingFee = await marketPlaceContract.methods
        .getListingPrice()
        .call();
      listingFee = listingFee.toString();
      planetRunnerContract.methods
        .createToken()
        .send({
          from: account,
          gas: 8000000
        })
        .on('receipt', async (receipt: any) => {
          console.log('minted');
          console.log(receipt);
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          console.log(tokenId, planetRunnerAddress);
          await marketPlaceContract.methods
            .registMarketItem(planetRunnerAddress, tokenId, listingFee)
            .send({
              value: listingFee,
              from: account,
              gas: 8000000
            })
            .on('receipt', function () {
              getSupply();
            });
        });
    } else {
      message.error('sold out');
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {isLogin ? (
        <div className="flex flex-col items-center w-52">
          <span>{`${account}`}</span>
          <span>{`${supply.mintCount} / ${supply.totalCount}`}</span>
          <Button type="primary" onClick={mintNFT} className="w-20 mt-5">
            Mint
          </Button>
        </div>
      ) : (
        <div>
          <Button type="primary" onClick={connection} className="w-40 h-12">
            connection
          </Button>
        </div>
      )}
    </div>
  );
};

export default Mint;
