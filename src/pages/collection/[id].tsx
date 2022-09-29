import { message, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Items from '@components/Items';
import {
  CollectionType,
  ExploreCollectionType,
  ItemTokenDataType,
  ItemType
} from '@libs/client/client';
import { useRouter } from 'next/router';
import { extractMetadataUrl } from '@libs/client/utils';
import Image from 'next/image';
import { GetServerSideProps, NextPage } from 'next';

const { TabPane } = Tabs;

const ExploreCollection: NextPage<ExploreCollectionType> = ({
  planetRunnerContract,
  currentAccount,
  network
}: ExploreCollectionType) => {
  const [myItemList, setMyItemList] = useState<ItemType[]>([]);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | any>();
  const [bannerImage, setBannerImage] = useState<HTMLImageElement | any>();
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (planetRunnerContract && currentAccount && network) {
      const loadMyItemList = async (planetRunnerContract: any) => {
        const NFTsTokenData: ItemTokenDataType[] =
          await planetRunnerContract.methods.getCollectionTokens().call();

        const NFTsMetadata = await Promise.all(
          NFTsTokenData.filter(
            res => res.nftTokenCollection === router.query.id
          )
            .filter(res => res.nftTokenURI.startsWith('https://'))
            .map(res =>
              Axios.get(res.nftTokenURI).then(({ data }) =>
                Object.assign(data, res)
              )
            )
        );

        const items: ItemType[] = NFTsMetadata.map(metadata => {
          const item: ItemType = {
            nftTokenId: metadata.nftTokenId,
            nftTokenURI: metadata.nftTokenURI,
            imageURL: `https://ipfs.io/ipfs/${metadata.image.split('//')[1]}`,
            name: metadata.name,
            description: metadata.description,
            supply: metadata.supply,
            collection: metadata.collection,
            blockchain: metadata.blockchain
          };
          return item;
        });
        setMyItemList(items.sort().reverse());
      };
      loadMyItemList(planetRunnerContract);

      const loadMyCollectionList = async () => {
        await fetch('/api/collection/detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            networkId: network.networkId,
            name: router.query.id
          })
        })
          .then(response => response.json().catch(() => {}))
          .then(async (data: { collection: CollectionType }) => {
            if (data?.collection) {
              setDescription(data.collection.description);
              if (data.collection.logoImageMetadata) {
                Axios.get(data.collection.logoImageMetadata).then(({ data }) =>
                  setLogoImage(
                    <div className="border-[6px] border-white dark:border-deepdark rounded-2xl">
                      <Image
                        src={extractMetadataUrl(data.image)}
                        width="150"
                        height="150"
                        alt={data.name}
                        className="rounded-xl"
                      />
                    </div>
                  )
                );
              }

              if (data.collection.bannerImageMetadata) {
                Axios.get(data.collection.bannerImageMetadata).then(
                  ({ data }) =>
                    setBannerImage(
                      <Image
                        src={extractMetadataUrl(data.image)}
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
                    )
                );
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      };
      loadMyCollectionList();
    } else {
      setMyItemList([]);
    }
  }, [planetRunnerContract, currentAccount, network, router.query.id]);

  return (
    <div>
      <div className="w-full h-[20rem] relative">
        <div className="w-full h-full absolute z-10 bg-grey2 bg-opacity-20"></div>
        {bannerImage}
      </div>
      <div className="absolute top-[17rem] left-5 z-20">{logoImage}</div>
      <div className="flex sm:flex-row flex-col w-42 mt-16">
        <div className="flex flex-col justify-center mt-2 sm:mt-0 sm:ml-10">
          <div className="text-3xl font-semibold">{router.query.id}</div>
          <div className="text-base font-normal mt-5 dark:text-grey2">
            {description}
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
                  <Items itemList={myItemList} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExploreCollection;
