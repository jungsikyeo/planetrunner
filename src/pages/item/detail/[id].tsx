import { Card, Collapse, Empty, Image, Table, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  AlignLeftOutlined,
  ProfileOutlined,
  StockOutlined,
  TagFilled,
  TagsFilled,
  UnorderedListOutlined,
  ZoomInOutlined
} from '@ant-design/icons';
import { loginWarningNoti } from '@components/notification';
import Axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ItemDefailType, ItemType } from '@libs/client/client';
import { extractMetadataUrl } from '@libs/client/utils';
import { ethers } from 'ethers';
import CurrentPriceOwner from '@components/item/detail/CurrenPriceOwner';
import CurrentPriceNotOwner from '@components/item/detail/CurrenPriceNotOwner';

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

const columns = [
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text: string) => <>{text}</>
  },
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    key: 'expiration',
    render: (text: string) => <Paragraph ellipsis>{text}</Paragraph>
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text: string) => <Paragraph ellipsis>{text}</Paragraph>
  }
];

const data: any[] = [];

// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     price: `100 ETH`,
//     expiration: `${(1 + i).toFixed()} minutes ago`,
//     from: `0x5A2609D698DE041B1Ba77139A4229c8a161dDd9e`
//   });
// }

const NftDetail: NextPage<ItemDefailType> = ({
  openPlanetContract,
  userContract,
  currentAccount,
  isUserLoggedIn
}: ItemDefailType) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [address, setAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sellPrice, setSellPrice] = useState(price);
  const [alertText, setAlertText] = useState(false);

  useEffect(() => {
    const getNFTList = async () => {
      if (openPlanetContract && router.query.id) {
        const tokenId: number = Number(router.query.id);
        const tokenUri = await openPlanetContract.methods
          .tokenURI(tokenId)
          .call();
        await Axios.get(tokenUri).then(async ({ data }) => {
          setName(data.name);
          setImageUrl(extractMetadataUrl(data.image));
          setCollectionName(data.collection);
          setDescription(data.description);
        });
        const price: string = await openPlanetContract.methods
          .getNftTokenPrice(tokenId)
          .call();
        setPrice(Number(ethers.utils.formatEther(String(price))));
        setSellPrice(Number(ethers.utils.formatEther(String(price))));

        if (currentAccount) {
          const result = await openPlanetContract.methods
            .getNftTokens(currentAccount)
            .call({ from: currentAccount });

          const isOwner =
            result.filter((res: ItemType) => res.nftTokenId === router.query.id)
              .length > 0
              ? true
              : false;
          setIsOwner(isOwner);
        }
      }
    };
    getNFTList();
  }, [currentAccount, openPlanetContract, router.query.id]);

  const handleBuyNow = async () => {
    if (!isUserLoggedIn) {
      router.push('/login');
    } else {
      userContract.methods
        .buyNft(router.query.id)
        .send({
          from: currentAccount,
          value: ethers.utils.parseEther(String(price)),
          gas: 250000
        })
        .once('receipt', (receipt: any) => router.push('/mypage/1'));
    }
  };

  const handleMakeOffer = async () => {
    alert('This is not ready yet.');
    return;
  };

  const openSell = async () => {
    await setOpenModal(!openModal);
  };

  const handleSell = async () => {
    await openSell();
  };

  const handleSendTransfer = async () => {
    if (!currentAccount) {
      loginWarningNoti();
      return;
    }
    openPlanetContract.methods
      .transferFrom(currentAccount, address, router.query.id)
      .send({
        from: currentAccount,
        gas: 210000
      })
      .once('receipt', async (receipt: any) => {
        await router.reload();
      });
  };

  const handleListing = async () => {
    const isSell = await handleSellPrice(Number(sellPrice));
    if (isSell) {
      const result = await openPlanetContract.methods
        .getNftTokens(currentAccount)
        .call({ from: currentAccount });

      const isOwner =
        result.filter((res: ItemType) => res.nftTokenId === router.query.id)
          .length > 0
          ? true
          : false;
      setIsOwner(isOwner);

      if (isOwner) {
        await openPlanetContract.methods
          .addToMarket(
            router.query.id,
            ethers.utils.parseEther(String(sellPrice))
          )
          .send({
            from: currentAccount,
            gas: 210000
          });

        await router.reload();
      } else {
        message.error('You are not Item Owner.');
        setOpenModal(false);
      }
    }
  };

  const handleSellPrice = async (value: number) => {
    if (Number(value) === 0) {
      await setAlertText(true);
      return false;
    }

    if (Number(price) > 0 && Number(value) >= Number(price)) {
      await setAlertText(true);
      return false;
    }

    await setSellPrice(value);
    await setAlertText(false);
    return true;
  };

  return (
    <div className="w-full h-full">
      <div className="mx-5 my-10 sm:m-10">
        <div className="flex justify-center">
          <div className="w-full sm:w-[50rem] md:w-[65rem]">
            {/* Header */}
            <div className="h-20 flex flex-col">
              <Title level={5} className="text-info">
                <Link href={`/collection/${collectionName}`}>
                  {collectionName}
                </Link>
              </Title>
              <Title level={2} className="mt-0 dark:text-white">
                {name}
              </Title>
            </div>

            {/* // NFT image Box  */}
            <div className="w-full flex flex-col sm:flex-row justify-start items-start">
              <div className="w-full sm:w-1/2 flex flex-col mr-5 mb-10">
                <Card
                  size="small"
                  title={''}
                  className="flex justify-center items-center rounded-lg mb-5 dark:bg-dark dark:border-grey3 dark:border-opacity-10"
                >
                  <Image
                    src={imageUrl}
                    alt={`${name}`}
                    width="100%"
                    preview={false}
                  />
                </Card>
                {/* Curren Price Box */}
                {isOwner ? (
                  <CurrentPriceOwner
                    price={price}
                    setAddress={setAddress}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    name={name}
                    imageUrl={imageUrl}
                    alertText={alertText}
                    handleSell={handleSell}
                    handleMakeOffer={handleMakeOffer}
                    handleSendTransfer={handleSendTransfer}
                    handleSellPrice={handleSellPrice}
                    handleListing={handleListing}
                  />
                ) : (
                  <CurrentPriceNotOwner
                    price={price}
                    setAddress={setAddress}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    name={name}
                    imageUrl={imageUrl}
                    alertText={alertText}
                    handleSell={handleSell}
                    handleMakeOffer={handleMakeOffer}
                    handleBuyNow={handleBuyNow}
                    handleSellPrice={handleSellPrice}
                    handleListing={handleListing}
                  />
                )}
              </div>

              {/* Order Box */}
              <div className="w-full sm:w-1/2 flex flex-col">
                {/* Description */}
                <div>
                  <Collapse
                    defaultActiveKey={['1', '2']}
                    expandIconPosition={'end'}
                    className="rounded-lg mb-5 dark:bg-dark dark:border-grey3 dark:border-opacity-10"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <AlignLeftOutlined />
                          <span className="ml-2">Description</span>
                        </div>
                      }
                      key="1"
                      className="rounded-t-lg"
                    >
                      {description}
                    </Panel>
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <TagsFilled />
                          <span className="ml-2">Properties</span>
                        </div>
                      }
                      key="2"
                    >
                      <Empty />
                    </Panel>
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <ProfileOutlined />
                          <span className="ml-2">About {collectionName}</span>
                        </div>
                      }
                      key="3"
                    >
                      <Empty />
                    </Panel>
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <ZoomInOutlined />
                          <span className="ml-2">Details</span>
                        </div>
                      }
                      key="4"
                      className="rounded-lg"
                    >
                      <Empty />
                    </Panel>
                  </Collapse>
                </div>
                {/* Price Box */}
                <div>
                  <Collapse
                    expandIconPosition={'end'}
                    className="rounded-lg mb-5 dark:bg-dark dark:border-grey3 dark:border-opacity-10"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <StockOutlined />
                          <span className="ml-2">Price History</span>
                        </div>
                      }
                      key="1"
                      className="rounded-b-lg dark:rounded-lg"
                    >
                      <Empty />
                    </Panel>
                  </Collapse>
                  {/* Listings Box */}
                  <Collapse
                    expandIconPosition={'end'}
                    className="rounded-lg mb-5 dark:bg-dark dark:border-grey3 dark:border-opacity-10"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <TagFilled />
                          <span className="ml-2">Listings</span>
                        </div>
                      }
                      key="1"
                      className="rounded-b-lg  dark:rounded-lg"
                    >
                      <Empty />
                    </Panel>
                  </Collapse>
                  {/* Offers Box */}
                  <Collapse
                    defaultActiveKey={['1']}
                    expandIconPosition={'end'}
                    className="rounded-lg dark:bg-dark dark:border-grey3 dark:border-opacity-10"
                  >
                    <Panel
                      header={
                        <div className="flex items-center font-semibold dark:text-white">
                          <UnorderedListOutlined />
                          <span className="ml-2">Offers</span>
                        </div>
                      }
                      key="1"
                      className="mb-5 rounded-b-lg dark:rounded-lg"
                    >
                      {/* <Empty /> */}
                      <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{
                          pageSize: 50
                        }}
                        scroll={{
                          y: 240
                        }}
                      />
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
