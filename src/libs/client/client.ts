/* new */
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
  network: {
    networkId: string;
    networkName: string;
  };
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

/* old */
export type CollectionType = {
  name: string;
  logoImageUrl?: string;
  logoImageMetadata?: string;
  featuredImageUrl?: string;
  featuredImageMetadata?: string;
  bannerImageUrl?: string;
  bannerImageMetadata?: string;
  account: string;
  networkId: string;
  slug: string;
  description: string;
  blockchain: string;
};

export type ItemType = {
  nftTokenId?: string;
  nftTokenURI?: string;
  imageURL?: string | any;
  name: string;
  description?: string;
  supply?: number;
  collection?: string;
  blockchain?: string;
  image?: File | null;
  price?: number;
  external_link?: string;
};

export type CreateCollectionType = {
  isUserLoggedIn: boolean;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
  connectWallet: any;
};

export type CreateItemType = {
  userContract: any;
  isUserLoggedIn: boolean;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
  collections: string[];
  connectWallet: any;
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

export type ExploreCollectionType = {
  marketPlaceContract: any;
  planetRunnerContract: any;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
};

export type ExplorePropsType = {
  network: {
    networkId: string;
  };
  currentAccount: string;
  isUserLoggedIn: boolean;
};

export type LoginPropsType = {
  connectWallet: any;
};

export type HomePropsType = {
  web3: any;
  planetRunnerContract: any;
  isUserLoggedIn: boolean;
  currentAccount: string;
  network: {
    networkId: string;
    networkName: string;
  };
};

export type HeaderPropsType = {
  title: string;
  setTitle: any;
  network: {
    networkId: string;
    networkName: string;
  };
  isUserLoggedIn: boolean;
  currentAccount: string;
  balance: string;
  sidebar: boolean;
  theme: string | any;
  setSidebar: any;
  setTheme: any;
  connectWallet: any;
  disconnectWallet: any;
};

export type AppLayoutPropsType = {
  children: React.ReactNode | any;
};

export const ICollections: CollectionType[] = [
  {
    name: '',
    logoImageUrl: '',
    featuredImageUrl: '',
    account: '',
    networkId: '',
    slug: '',
    description: '',
    blockchain: ''
  }
];

export interface IWindow {
  ethereum: any;
}

export type CurrentPriceOwnerType = {
  price: string;
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
