import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button, message, Progress, Spin, Switch } from 'antd';
import { IWindow, MintType } from '@libs/client/client';
import Image from 'next/image';
import logo from '../../public/logo.png';
import matamask from '/public/metamask-icon.png';
import { longAddress } from '@libs/client/utils';
import { useTheme } from 'next-themes';

const Mint: NextPage<MintType> = ({
  planetRunnerContract,
  marketPlaceContract,
  planetRunnerAddress
}: MintType) => {
  const [isLogin, setIsLogin] = useState(false);
  const [account, setAccount] = useState('');
  const [supply, setSupply] = useState({
    mintCount: 0,
    totalCount: 100
  });
  const [loading, setLoading] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const { theme, setTheme } = useTheme();

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
          gas: 300000
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
              gas: 300000
            })
            .on('receipt', function () {
              message.info(`You successfully minted PlanetRunner #${tokenId}`);
              getSupply();
            });
        });
    } else {
      message.error('sold out');
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('themeMode');
    if (theme === 'dark') {
      setSwitchOn(true);
    } else {
      setSwitchOn(false);
    }
  }, []);

  const handleNightMode = async () => {
    const themeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(themeMode);
    localStorage.setItem('themeMode', themeMode);
  };

  return (
    <div className="w-full h-screen flex mt-32 justify-center">
      {isLogin ? (
        <div>
          <div className="flex justify-center">
            <span className="text-6xl font-extrabold italic">
              Planet Runner
            </span>
          </div>
          <div className="w-[50rem] min-w-[50rem] h-[20rem] flex flex-col items-center justify-evenly mt-5 border rounded-3xl bg-dark bg-opacity-10 dark:bg-none">
            <div className="flex">
              <div className="w-1/3 flex justify-center">
                <Image width="180" height="150" src={logo} alt="logo" />
              </div>
              <div className="w-2/3 flex flex-col mx-5">
                <span>
                  These mystery boxes each contain an NFT Sneaker of random
                  quality and type. Used in the Planet Runner mobile app, these
                  NFT Sneakers facilitate the player’s ability to move to earn
                  through walking, jogging or running outdoors.
                </span>

                <span className="text-sm font-semibold self-end mt-5">{`${(
                  (Number(supply.mintCount) / Number(supply.totalCount)) *
                  100
                ).toFixed()}% (${supply.mintCount} / ${
                  supply.totalCount
                })`}</span>
                <Progress
                  percent={(supply.mintCount / supply.totalCount) * 100}
                  showInfo={false}
                />
                <div className="flex justify-between items-center mt-5">
                  <Switch
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                    onChange={handleNightMode}
                    className="m-4"
                    defaultChecked={switchOn}
                  />
                  <span className="">{longAddress(account)}</span>
                  <Button
                    type="primary"
                    onClick={mintNFT}
                    className="w-32 h-12"
                  >
                    Mint
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <main className="m-10">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">
                Connect your wallet.
              </span>
              <span className="text-base font-medium mt-2">
                If you don`t have a wallet yet, you can select a provider and
                create one now.
              </span>
            </div>
            <ul className="w-full h-20 flex items-center mt-10 border border-grey3 rounded-lg">
              <li
                className={`w-full flex justify-between mx-5 my-2 hover:cursor-pointer ${
                  loading ? `opacity-30` : ``
                }`}
                onClick={connection}
              >
                <div className="w-full flex ">
                  <div className="flex items-center">
                    <Image
                      src={matamask}
                      width="30"
                      height="30"
                      alt="metamask"
                    />
                  </div>
                  <div className="flex items-center ml-5 text-base font-semibold ">
                    Metamask
                  </div>
                </div>
                <div className="bg-info rounded-xl flex justify-center items-center">
                  <span className="text-white font-semibold p-2">Popular</span>
                </div>
                <Spin
                  spinning={loading}
                  className="flex justify-center items-center ml-5"
                ></Spin>
              </li>
            </ul>
          </main>
        </div>
      )}
    </div>
  );
};

export default Mint;
