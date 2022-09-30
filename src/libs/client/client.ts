export interface INft {
  price: String;
  itemId: String;
  tokenId: String;
  creator: String;
  seller: String;
  owner?: String;
  buyer?: String;
  image: String;
  name: String;
  description: String;
  tokenURI?: String;
  sold: boolean;
}

export type HomeType = {
  marketPlaceContract: any;
  planetRunnerContract: any;
  currentAccount: string;
};

export type ItemDetailType = {
  planetRunnerContract: any;
  marketPlaceContract: any;
  planetRunnerAddress: string;
  currentAccount: string;
  isUserLoggedIn: boolean;
};

export type MintType = {
  planetRunnerContract: any;
  marketPlaceContract: any;
  planetRunnerAddress: string;
  currentAccount: string;
  isUserLoggedIn: boolean;
};

export type HeaderPropsType = {
  title: string;
  setTitle: any;
  isUserLoggedIn: boolean;
  currentAccount: string;
  balance: string;
  sidebar: boolean;
  theme: string | any;
  setSidebar: any;
  setTheme: any;
  disconnectWallet: any;
};

export type ItemTokenDataType = {
  nftTokenId: number;
  nftTokenURI: string;
  nftTokenCollection: string;
};

export type MyPagePropsType = {
  planetRunnerContract: any;
  marketPlaceContract: any;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
};

export type LoginPropsType = {
  connectWallet: any;
};

export type AppLayoutPropsType = {
  children: React.ReactNode | any;
};

export interface IWindow {
  ethereum: any;
}

export type CurrentPriceOwnerType = {
  price: string;
  address: string;
  setAddress: any;
  openModal: any;
  setOpenModal: any;
  name: string;
  imageUrl: string;
  alertText: boolean;
  sold: boolean;
  handleSell: any;
  handleSendTransfer: any;
  handleSellPrice: any;
  handleListing: any;
};

export type CurrentPriceNotOwnerType = {
  price: string;
  handleMakeOffer: any;
  handleBuyNow: any;
};
