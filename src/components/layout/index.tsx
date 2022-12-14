import Header from './header';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import {
  getNetworkName,
  loginWarningNoti,
  logOutSuccessNoti
} from '@components/notification';
import Web3Modal from 'web3modal';
import Marketplace from '@abis/Market.json';
import PlanetRunners from '@abis/NFT.json';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { AppLayoutPropsType, IWindow } from '@libs/client/client';
import { NextPage } from 'next';
import { useTheme } from 'next-themes';

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

const networkId = process.env.NEXT_PUBLIC_MARKET_NETWORK || '1663729648756';

const BaseLayout: NextPage<AppLayoutPropsType> = ({
  children
}: AppLayoutPropsType) => {
  const [title, setTitle] = useState('');
  const [web3, setWeb3] = useState({});
  const [network, setNetwork] = useState({
    networkId: networkId,
    networkName: getNetworkName(networkId)
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [planetRunnerAddress, setPlanetRunnerAddress] = useState('');
  const [marketPlaceContract, setMarketPlaceContract] = useState(null);
  const [planetRunnerContract, setPlanetRunnerContract] = useState(null);
  const [balance, setbalance] = useState('');
  const [sidebar, setSidebar] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const loadPlanetRunnerContract = async () => {
      const web3Modal = new Web3Modal();
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();

      const planetRunnerAddress = (PlanetRunners as any).networks[networkId]
        .address;
      const planetRunnerContract: any = new web3.eth.Contract(
        (PlanetRunners as any).abi,
        planetRunnerAddress
      );
      setPlanetRunnerContract(planetRunnerContract);
      setPlanetRunnerAddress(planetRunnerAddress);
    };
    loadPlanetRunnerContract();

    const loadMarketPlaceContract = async () => {
      const web3Modal = new Web3Modal();
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();

      const marketPlaceContract: any = new web3.eth.Contract(
        (Marketplace as any).abi,
        (Marketplace as any).networks[networkId].address
      );

      setMarketPlaceContract(marketPlaceContract);
    };
    loadMarketPlaceContract();

    if (!isUserLoggedIn) {
      connectWallet();
    }

    const settingThemeMode = async () => {
      const themeMode = localStorage.getItem('themeMode') || 'light';
      setTheme(themeMode);
    };
    settingThemeMode();
  }, []);

  const connectWallet = async () => {
    try {
      const ethereum: IWindow['ethereum'] = (window as any).ethereum;
      if (!ethereum) {
        message.error('Metamask not detected');
        return false;
      }

      const metamaskNetworkId: string | any = await ethereum.request({
        method: 'net_version'
      });

      if (metamaskNetworkId !== networkId) {
        console.log(metamaskNetworkId, networkId);
        message.warning('you are not connected to the ethereum testnet!');
        router.push('/login');
        return false;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setIsUserLoggedIn(true);

        const web = new Web3(ethereum);
        let balanceWei = await web.eth.getBalance(accounts[0]);
        let balanceETH = await web.utils.fromWei(balanceWei, 'ether');
        const balanceStr = String(balanceETH);
        setbalance(balanceStr);
        return true;
      }
    } catch (e) {
      message.error('An unexpected problem has occurred.');
      console.log(e);
      return false;
    }
  };

  const disconnectWallet = async () => {
    try {
      await setIsUserLoggedIn(false);
      await setCurrentAccount('');
      await setbalance('');
      await logOutSuccessNoti();
      if (router.route.startsWith('/mint')) {
        await router.reload();
      } else {
        await router.push('/login');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getBalance = async (account: string) => {
    if ((web3 as any).eth) {
      let balanceWei = await (web3 as any).eth.getBalance(account);
      let balanceETH = await (web3 as any).utils.fromWei(balanceWei, 'ether');
      const balanceStr = String(balanceETH);
      setbalance(balanceStr);
    } else {
      disconnectWallet();
    }
  };

  const handleAccountChange = async (...args: (string | any[])[]) => {
    const _account = args[0][0];
    if (args[0].length === 0) {
      loginWarningNoti();
      disconnectWallet();
    } else if (_account !== currentAccount) {
      await setCurrentAccount(_account);
      await getBalance(_account);
    }
  };

  useEffect(() => {
    (window as any).ethereum?.on('accountsChanged', handleAccountChange);
    return () => {
      (window as any).ethereum?.removeListener(
        'accountsChanged',
        handleAccountChange
      );
    };
  });

  const handleNetworkChanged = (...args: any[]) => {
    const networkId = args[0];
    const networkName = getNetworkName(networkId);
    setNetwork({ networkId, networkName });
    isUserLoggedIn && getBalance(currentAccount);
  };

  useEffect(() => {
    (window as any).ethereum?.on('chainChanged', handleNetworkChanged);
    return () => {
      (window as any).ethereum?.removeListener(
        'chainChanged',
        handleNetworkChanged
      );
    };
  });

  const handleDisconnect = (...args: any[]) => {
    disconnectWallet();
  };

  useEffect(() => {
    (window as any).ethereum?.on('disconnect', handleDisconnect);
    return () => {
      (window as any).ethereum?.removeListener('disconnect', handleDisconnect);
    };
  });

  useEffect(() => {
    setSidebar(false);
  }, [children]);

  return (
    <div>
      <Header
        title={title}
        setTitle={setTitle}
        isUserLoggedIn={isUserLoggedIn}
        currentAccount={currentAccount}
        balance={balance}
        sidebar={sidebar}
        theme={theme}
        disconnectWallet={disconnectWallet}
        setTheme={setTheme}
        setSidebar={setSidebar}
      />
      {React.cloneElement(children, {
        web3,
        isUserLoggedIn,
        currentAccount,
        marketPlaceContract,
        planetRunnerContract,
        planetRunnerAddress,
        network,
        connectWallet
      })}
    </div>
  );
};

export default BaseLayout;
