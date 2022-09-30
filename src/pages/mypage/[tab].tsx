import type { NextPage } from 'next';
import { message, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { PaperClipOutlined } from '@ant-design/icons';
import Items from '@components/Items';
import axios from 'axios';
import { INft, MyPagePropsType } from '@libs/client/client';
import { useRouter } from 'next/router';
import { extractMetadataUrl } from '@libs/client/utils';

const { TabPane } = Tabs;

const MyPage: NextPage<MyPagePropsType> = ({
  planetRunnerContract,
  marketPlaceContract,
  currentAccount,
  network
}: MyPagePropsType) => {
  const [myItemList, setMyItemList] = useState<INft[]>([]);
  const [mySellItemList, setMySellItemList] = useState<INft[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const tab: string | undefined | any = router.query.tab || '1';

  useEffect(() => {
    if (
      planetRunnerContract &&
      marketPlaceContract &&
      currentAccount &&
      network
    ) {
      const loadMyItemList = async () => {
        const data = await marketPlaceContract.methods
          .fetchMyNFTs()
          .call({ from: currentAccount });

        const nfts: INft[] = await Promise.all(
          data.map(async (i: INft) => {
            try {
              const tokenURI = await planetRunnerContract.methods
                .tokenURI(i.tokenId)
                .call();
              const meta = await axios.get(extractMetadataUrl(tokenURI));
              const nft = {
                price: i.price,
                tokenId: i.tokenId,
                creator: i.creator,
                seller: i.seller,
                owner: i.buyer,
                image: meta.data.image,
                description: meta.data.description,
                tokenURI: tokenURI,
                sold: i.sold
              };
              return nft;
            } catch (err) {
              console.log(err);
              return null;
            }
          })
        );
        setMyItemList(nfts.sort().reverse());
      };
      loadMyItemList();

      const loadMySellItemList = async () => {
        const data = await marketPlaceContract.methods
          .fetchMarketItems()
          .call();

        console.log(data);
        const nfts: INft[] = await Promise.all(
          data
            .filter(
              (nft: INft) =>
                nft.owner?.toUpperCase() == currentAccount.toUpperCase() ||
                (nft.seller.toUpperCase() == currentAccount.toUpperCase() &&
                  !nft.sold)
            )
            .map(async (i: INft) => {
              try {
                const tokenURI = await planetRunnerContract.methods
                  .tokenURI(i.tokenId)
                  .call();
                const meta = await axios.get(extractMetadataUrl(tokenURI));
                const nft = {
                  price: i.price,
                  tokenId: i.tokenId,
                  creator: i.creator,
                  seller: i.seller,
                  owner: i.buyer,
                  image: meta.data.image,
                  description: meta.data.description,
                  tokenURI: tokenURI,
                  sold: i.sold
                };
                return nft;
              } catch (err) {
                console.log(err);
                return null;
              }
            })
        );
        console.log(nfts);
        setMySellItemList(nfts.sort().reverse());
      };
      loadMySellItemList();
    } else {
      setMyItemList([]);
    }
    setLoading(false);
  }, [planetRunnerContract, marketPlaceContract, currentAccount, network]);

  const addressId =
    currentAccount?.length > 0
      ? `${currentAccount.substring(0, 6)} . . . ${currentAccount.substring(
          currentAccount.length - 4,
          currentAccount.length
        )}`
      : '';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAccount);
    message.success('Copied!');
  };

  return !loading ? (
    <div>
      <div className="w-full h-screen flex justify-start">
        <main className="w-full h-full flex flex-col p-14">
          <div className="flex sm:flex-row flex-col w-42 w">
            <div className="flex justify-center sm:block sm:justify-start">
              <div className="flex items-center justify-center rounded-full p-1 border-2 text-info">
                <Jazzicon
                  diameter={100}
                  seed={jsNumberForAddress(currentAccount)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-2 sm:mt-0 sm:ml-10">
              <div className="text-3xl font-semibold">{addressId}</div>
              <div className="w-full flex justify-center sm:justify-start mt-2">
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center border-2 border-grey3 hover:border-black hover:bg-black hover:text-white hover:transition-all rounded-md font-medium py-1 px-2"
                >
                  <span>{addressId}</span>
                  <PaperClipOutlined className="ml-2" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-full mt-5">
            <div className="w-full h-auto flex justify-center sm:block sm:justify-start">
              <Tabs
                defaultActiveKey={tab}
                className="w-full h-full text-base font-semibold dark:text-white"
              >
                <TabPane tab="My NFTs" key="1">
                  <Items itemList={myItemList} />
                </TabPane>
                <TabPane tab="My Sell NFTs" key="2">
                  <Items itemList={mySellItemList} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen flex items-center justify-center">
      <Spin spinning={loading} size="large"></Spin>
    </div>
  );
};

export default MyPage;
