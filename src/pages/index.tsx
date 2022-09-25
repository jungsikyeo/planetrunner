import { NextPage } from 'next';
import Items from '@components/Items';
import {
  HomePropsType,
  ItemTokenDataType,
  ItemType
} from '@libs/client/client';
import { Button } from 'antd';
import Axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { extractMetadataUrl } from '@libs/client/utils';
import { useRouter } from 'next/router';

const networkId = process.env.NEXT_PUBLIC_MARKET_NETWORK || 1663321162161;

const Home: NextPage<HomePropsType> = ({
  currentAccount,
  isUserLoggedIn,
  openPlanetContract
}: HomePropsType) => {
  const [trendItemList, setTrendItemList] = useState<ItemType[]>();
  const [mainImage, setMainImage] = useState<ItemType>();
  const router = useRouter();

  useEffect(() => {
    trendItemList &&
      trendItemList.map((item, key) => {
        if (key === 0) {
          setMainImage({
            nftTokenId: item.nftTokenId,
            nftTokenURI: item.nftTokenURI,
            imageURL: item.imageURL,
            name: item.name,
            description: item.description,
            supply: item.supply,
            collection: item.collection,
            blockchain: item.blockchain
          });
        }
      });
  }, [trendItemList]);

  useEffect(() => {
    if (openPlanetContract) {
      const loadMyItemList = async (contract: any) => {
        const NFTsTokenData: ItemTokenDataType[] = await contract.methods
          .getMarketList()
          .call();

        const NFTsMetadata = await Promise.all(
          NFTsTokenData.filter(res =>
            res.nftTokenURI.startsWith('https://')
          ).map(res =>
            Axios.get(res.nftTokenURI).then(({ data }) =>
              Object.assign(data, res)
            )
          )
        );

        const items: ItemType[] = NFTsMetadata.map(metadata => {
          const item: ItemType = {
            nftTokenId: metadata.nftTokenId,
            nftTokenURI: metadata.nftTokenURI,
            imageURL: extractMetadataUrl(metadata.image),
            name: metadata.name,
            description: metadata.description,
            supply: metadata.supply,
            collection: metadata.collection,
            blockchain: metadata.blockchain
          };
          return item;
        });

        setTrendItemList(items.sort().reverse());
      };
      loadMyItemList(openPlanetContract);
    } else {
      setTrendItemList([]);
    }
  }, [openPlanetContract]);

  const handleExplore = () => {
    router.push('/explore');
  };

  const handleCreate = () => {
    if (isUserLoggedIn) {
      router.push(`/item/create/${networkId}/${currentAccount}`);
    } else {
      router.push('/login');
    }
  };
  return (
    <div className="w-full h-auto flex flex-col justify-between ">
      <div className="w-full h-[50rem] relative opacity-30">
        <div
          style={{
            position: 'absolute',
            zIndex: 3,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(transparent, rgb(255, 255, 255))'
          }}
        ></div>
        {mainImage && (
          <Image
            src={mainImage.imageURL}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt="image"
            style={{
              zIndex: 1,
              width: '100%',
              height: '100%'
            }}
          />
        )}
      </div>
      <div className="w-full h-[35rem] absolute left-0 top-52">
        <div className="w-full flex justify-center mb-10">
          <div className="w-4/5 xl:w-[80rem] flex flex-col xl:flex-row justify-between">
            <div className="w-full xl:w-1/2 flex flex-col justify-evenly xl:justify-center xl:ml-10">
              <p className="w-full text-[2.7rem] font-bold leading-tight break-words flex justify-center xl:justify-start">
                Discover, collect, and sell extraordinary NFTs
              </p>
              <p className="w-full mt-5 text-2xl font-normal flex justify-center xl:justify-start">
                OpenSea is the world`s first and largest NFT marketplace
              </p>
              <div className="flex justify-center xl:justify-start mt-5">
                <Button
                  type="primary"
                  onClick={handleExplore}
                  className="w-36 h-14 bg-info border-info flex justify-center items-center"
                >
                  Explore
                </Button>
                <Button
                  type="primary"
                  onClick={handleCreate}
                  className="w-36 h-14 bg-white border-white text-info ml-5 flex justify-center items-center"
                >
                  Create
                </Button>
              </div>
            </div>
            <div className="w-full xl:w-1/2 mt-10 xl:mt-0 flex justify-center xl:justify-end xl:mr-10">
              {mainImage && (
                <Link href={`/item/detail/${mainImage?.nftTokenId}`}>
                  <a>
                    <div className="w-[35rem] shadow-2xl rounded-3xl overflow-hidden">
                      <Image
                        src={mainImage.imageURL}
                        width="560"
                        height="500"
                        layout="fixed"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-t-3xl hover:scale-110 transition-all z-10"
                        alt="image"
                      />

                      <div className="flex">
                        <div className="flex flex-col my-3 mx-7">
                          <span className="text-lg font-semibold">
                            {mainImage?.name}
                          </span>
                          <span className="mt-2">{mainImage?.collection}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full xl:w-4/5 flex flex-col items-center">
            <div className="mt-10 text-2xl font-semibold">Recently Items</div>
            <div className="mt-5 mx-10">
              {trendItemList && <Items itemList={trendItemList} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
