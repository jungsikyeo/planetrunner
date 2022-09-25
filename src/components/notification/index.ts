import { notification } from 'antd';

//메타마스크 설치 안내
const metamaskInstallNoti = () => {
  notification.warning({
    message: 'Please Install the Metamask',
    description:
      'You have to Install the Metamask. Visit the : https://metamask.io',
    placement: 'top'
  });
};

//메타마스크 연결 필요 안내
const loginWarningNoti = () => {
  notification.warning({
    message: 'Please Connect to Metamask',
    description: 'You have to connect with the Metamask.',
    placement: 'top'
  });
};

//메타마스크 연결 성공 안내
const loginSuccessNoti = () => {
  notification.success({
    message: 'You are successfully connected Metamask',
    description: 'Start minting your own NFTs with NFT Exchange today!',
    placement: 'top'
  });
};

//메타마스크 연결해제 성공 안내
const logOutSuccessNoti = () => {
  notification.success({
    message: 'You have been logged out successfully',
    description: 'Please connect your wallet again.',
    placement: 'top'
  });
};

//메타마스크 계정 변경 안내
const changedAccountNoti = (accountAdress: string) => {
  notification.success({
    message: 'You are successfully changed Account',
    description: 'Now adress is ' + accountAdress,
    placement: 'top'
  });
};

//메타마스크 체인 변경 안내
const changedNetworkNoti = (chainName: string) => {
  notification.success({
    message: 'You are successfully connected Network',
    description: 'Now network is ' + chainName,
    placement: 'top'
  });
};

const getNetworkName = (networkId: string) => {
  switch (networkId) {
    case '1':
      return 'Ethereum MainNet';
    case '3':
      return 'Ropsten TestNet';
    case '42':
      return 'Kovan TestNet';
    case '4':
      return 'Rinkeby TestNet';
    case '5':
      return 'Georli TestNet';
    case '5777':
      return 'Ganache TestNet';
    case '1663321162161':
      return 'Ganache TestNet';
    default:
      return 'undefined';
  }
};

export {
  metamaskInstallNoti,
  loginSuccessNoti,
  logOutSuccessNoti,
  loginWarningNoti,
  changedAccountNoti,
  changedNetworkNoti,
  getNetworkName
};
