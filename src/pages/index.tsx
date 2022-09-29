import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Items from '@components/Items';
import { HomeType, INft } from '@libs/client/client';
import { useRouter } from 'next/router';
import { extractMetadataUrl } from '@libs/client/utils';
import { NextPage } from 'next';
import Image from 'next/image';
import logo from '../../public/logo.png';

const { TabPane } = Tabs;

const Home: NextPage<HomeType> = ({
  marketPlaceContract,
  planetRunnerContract,
  currentAccount,
  network
}: HomeType) => {
  const [myItemList, setMyItemList] = useState<INft[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (planetRunnerContract && currentAccount && network) {
      loadMyItemList();
    }
  }, [
    planetRunnerContract,
    currentAccount,
    network,
    router.query.id,
    marketPlaceContract
  ]);

  const loadMyItemList = async () => {
    const listings = await marketPlaceContract.methods
      .fetchMarketItems()
      .call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts: INft[] = await Promise.all(
      listings.map(async (i: INft) => {
        try {
          const tokenURI = await planetRunnerContract.methods
            .tokenURI(i.tokenId)
            .call();
          const meta = await axios.get(extractMetadataUrl(tokenURI));
          const nft: INft = {
            price: i.price,
            tokenId: i.tokenId,
            creator: i.creator,
            seller: i.seller,
            owner: i.buyer,
            sold: i.sold,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setMyItemList(nfts.filter((nft: INft) => nft !== null));
  };

  return (
    <div>
      <div className="w-full h-[20rem] relative">
        <div
          className="w-full h-full absolute z-10 flex justify-center items-center"
          style={{
            backgroundImage:
              'linear-gradient(to right top, #fb46f7, #ff1e99, #ff753b, #ffba00, #a8eb12)'
          }}
        >
          <span className="w-[40rem] min-w-[40rem] text-white text-7xl font-extrabold">
            Planet Runner
          </span>
        </div>
      </div>
      <div className="absolute top-[19rem] left-5 z-20">
        <div
          className="w-32 h-32 border-white border-4 rounded-xl flex justify-center items-center"
          style={{
            backgroundImage:
              'linear-gradient(to left bottom, #fb46f7, #ff1e99, #ff753b, #ffba00, #a8eb12)'
          }}
        >
          <Image width="100%" height="100%" src={logo} alt="logo" />
        </div>
      </div>
      <div className="flex sm:flex-row flex-col w-42 mt-16">
        <div className="flex flex-col justify-center mt-2 sm:mt-0 sm:ml-10">
          <div className="text-3xl font-semibold">{router.query.id}</div>
          <div className="text-base font-normal mt-5 dark:text-grey2">
            <span>
              These mystery boxes each contain an NFT Sneaker of random quality
              and type. Used in the Planet Runner mobile app, these NFT Sneakers
              facilitate the player’s ability to move to earn through walking,
              jogging or running outdoors.
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-screen flex justify-start">
        <main className="w-full h-full flex flex-col px-14">
          <div className="w-full h-full mt-5">
            <div className="w-full h-auto flex justify-center sm:block sm:justify-start">
              <Tabs
                defaultActiveKey="1"
                className="w-full h-full text-base font-semibold"
              >
                <TabPane tab="Items" key="1">
                  <Items itemList={myItemList} sellMode={true} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

// import Web3 from 'web3';
// import Web3Modal from 'web3modal';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// import Marketplace from '@abis/Marketplace.json';
// import PlanetRunners from '@abis/PlanetRunners.json';
// import { extractMetadataUrl } from '@libs/client/utils';
// import { Button } from 'antd';

// interface INft {
//   price: String;
//   tokenId: String;
//   seller: String;
//   owner?: String;
//   buyer?: String;
//   image: String;
//   name: String;
//   description: String;
//   tokenURI?: String;
// }

// export default function Home() {
//   const [nfts, setNfts] = useState<INft[]>([]);
//   const [loadingState, setLoadingState] = useState('not-loaded');

//   useEffect(() => {
//     loadNFTs();
//   }, []);

//   async function loadNFTs() {
//     const web3Modal = new Web3Modal();
//     const provider = await web3Modal.connect();
//     const web3 = new Web3(provider);
//     const networkId = await web3.eth.net.getId();

//     const marketPlaceAbi: any = Marketplace.abi;
//     const marketPlaceAddress: any = (Marketplace as any).networks[networkId]
//       .address;

//     const planetRunnerAbi: any = PlanetRunners.abi;
//     const planetRunnerAddress: any = (PlanetRunners as any).networks[networkId]
//       .address;

//     // Get all listed NFTs
//     const marketPlaceContract = new web3.eth.Contract(
//       marketPlaceAbi,
//       marketPlaceAddress
//     );
//     const listings = await marketPlaceContract.methods.getListedNfts().call();
//     // Iterate over the listed NFTs and retrieve their metadata
//     const nfts: INft[] = await Promise.all(
//       listings.map(async (i: INft) => {
//         try {
//           const planetRunnersContract = new web3.eth.Contract(
//             planetRunnerAbi,
//             planetRunnerAddress
//           );
//           const tokenURI = await planetRunnersContract.methods
//             .tokenURI(i.tokenId)
//             .call();
//           const meta = await axios.get(extractMetadataUrl(tokenURI));
//           const nft: INft = {
//             price: i.price,
//             tokenId: i.tokenId,
//             seller: i.seller,
//             owner: i.buyer,
//             image: meta.data.image,
//             name: meta.data.name,
//             description: meta.data.description
//           };
//           return nft;
//         } catch (err) {
//           console.log(err);
//           return null;
//         }
//       })
//     );
//     setNfts(nfts.filter((nft: INft) => nft !== null));
//     setLoadingState('loaded');
//   }

//   async function buyNft(nft: INft) {
//     console.log(nft.price);
//     const web3Modal = new Web3Modal();
//     const provider = await web3Modal.connect();
//     const web3 = new Web3(provider);
//     const networkId = await web3.eth.net.getId();
//     const marketPlaceAbi: any = Marketplace.abi;
//     const marketPlaceAddress: any = (Marketplace as any).networks[networkId]
//       .address;
//     const planetRunnerAddress: any = (PlanetRunners as any).networks[networkId]
//       .address;
//     const marketPlaceContract = new web3.eth.Contract(
//       marketPlaceAbi,
//       marketPlaceAddress
//     );
//     const accounts = await web3.eth.getAccounts();
//     console.log(
//       marketPlaceContract,
//       planetRunnerAddress,
//       nft.tokenId,
//       accounts[0],
//       nft.price
//     );
//     await marketPlaceContract.methods
//       .buyNft(planetRunnerAddress, nft.tokenId)
//       .send({ from: accounts[0], value: nft.price });
//     loadNFTs();
//   }

//   if (loadingState === 'loaded' && !nfts.length) {
//     return <h1 className="px-20 py-10 text-3xl">No items available!</h1>;
//   } else {
//     return (
//       <div className="flex justify-center">
//         <div className="px-4 max-w-full">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4 pt-4">
//             {nfts.map((nft, i) => (
//               <div key={i} className="border shadow rounded-xl overflow-hidden">
//                 <img src={extractMetadataUrl(nft.image)} />
//                 <div className="p-4">
//                   <p className="h-8 text-lg font-semibold flex justify-start items-center">
//                     {`#${nft.tokenId}`}
//                   </p>
//                 </div>
//                 <div className="p-4 bg-black">
//                   <p className="text-2xl font-bold text-white flex justify-center items-center">
//                     {Web3.utils.fromWei(String(nft.price), 'ether')} ETH
//                   </p>
//                   <Button
//                     className="mt-4 w-full h-12 text-white font-bold bg-info"
//                     onClick={() => buyNft(nft)}
//                   >
//                     Buy now
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
