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
import { INft, ItemDetailType } from '@libs/client/client';
import { extractMetadataUrl, shortAddress } from '@libs/client/utils';
import Web3 from 'web3';
import CurrentPriceOwner from '@components/item/detail/CurrenPriceOwner';
import CurrentPriceNotOwner from '@components/item/detail/CurrenPriceNotOwner';
import Web3Modal from 'web3modal';
import Marketplace from '@abis/Market.json';
import PlanetRunners from '@abis/NFT.json';

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

const NftDetail: NextPage<ItemDetailType> = ({
  planetRunnerContract,
  marketPlaceContract,
  planetRunnerAddress,
  currentAccount,
  isUserLoggedIn
}: ItemDetailType) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [metadataUrl, setMetadataUrl] = useState('');
  const [address, setAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sellPrice, setSellPrice] = useState(price);
  const [alertText, setAlertText] = useState(false);
  const [nftDetail, setNftDetail] = useState<INft>();

  useEffect(() => {
    const getNFT = async () => {
      if (planetRunnerContract && router.query.id) {
        const tokenId: number = Number(router.query.id);
        const tokenUri = await planetRunnerContract.methods
          .tokenURI(tokenId)
          .call();
        await Axios.get(extractMetadataUrl(tokenUri)).then(async ({ data }) => {
          setName(String(Number(data.name)));
          setImageUrl(extractMetadataUrl(data.image));
          setCollectionName('Planet Runner');
          setDescription(data.description);
          setAttributes(data.attributes);
          setMetadataUrl(extractMetadataUrl(tokenUri));
        });
        const nft: INft = await marketPlaceContract.methods
          .fetchSingleItem(tokenId)
          .call();
        setPrice(Number(Web3.utils.fromWei(String(nft.price), 'ether')));
        setSellPrice(Number(Web3.utils.fromWei(String(nft.price), 'ether')));
        setNftDetail(nft);

        const isOwner =
          nft.owner?.toUpperCase() === currentAccount?.toUpperCase() ||
          (nft.seller?.toUpperCase() === currentAccount?.toUpperCase() &&
            !nft.sold)
            ? true
            : false;
        setIsOwner(isOwner);
      }
    };
    getNFT();
  }, [
    currentAccount,
    marketPlaceContract,
    planetRunnerContract,
    router.query.id
  ]);

  const handleBuyNow = async () => {
    if (!isUserLoggedIn) {
      router.push('/login');
    } else {
      await marketPlaceContract.methods
        .createMarketSale(planetRunnerAddress, router.query.id)
        .send({
          from: currentAccount,
          gas: 8000000,
          value: Web3.utils.toWei(String(price), 'ether')
        })
        .once('receipt', (receipt: any) => router.push('/mypage/1'));
    }
  };

  const handleMakeOffer = async () => {
    alert('This is not ready yet.');
    return;
  };

  const handleSell = () => {
    setOpenModal(!openModal);
  };

  const handleSendTransfer = async () => {
    if (!currentAccount) {
      loginWarningNoti();
      return;
    }
    planetRunnerContract.methods
      .transferFrom(currentAccount, address, router.query.id)
      .send({
        from: currentAccount,
        gas: 210000
      })
      .once('receipt', (receipt: any) => {
        router.reload();
      });
  };

  const handleListing = async () => {
    const isSell = await handleSellPrice(Number(sellPrice));
    if (isSell) {
      const tokenId: number = Number(router.query.id);
      const nft: INft = await marketPlaceContract.methods
        .fetchSingleItem(tokenId)
        .call();

      let listingFee = await marketPlaceContract.methods
        .getListingPrice()
        .call();
      listingFee = listingFee.toString();

      const isOwner =
        nft.owner?.toUpperCase === currentAccount?.toUpperCase ||
        (nft.seller?.toUpperCase === currentAccount?.toUpperCase && !nft.sold)
          ? true
          : false;
      setIsOwner(isOwner);

      if (isOwner) {
        const web3Modal = new Web3Modal();
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();

        // Mint the NFT
        const planetRunnerAddress = (PlanetRunners as any).networks[networkId]
          .address;
        const planetRunnerContract = new web3.eth.Contract(
          (PlanetRunners as any).abi,
          planetRunnerAddress
        );
        const marketPlaceContract = new web3.eth.Contract(
          (Marketplace as any).abi,
          (Marketplace as any).networks[networkId].address
        );

        if (nft.seller == '0x0000000000000000000000000000000000000000') {
          marketPlaceContract.methods
            .createMarketItem(
              planetRunnerAddress,
              nftDetail?.itemId,
              Web3.utils.toWei(String(sellPrice), 'ether')
            )
            .send({
              from: currentAccount,
              value: listingFee,
              gas: 8000000
            })
            .on('receipt', (receipt: any) => {
              console.log(receipt);
              router.reload();
            });
        } else {
          if (nft.sold) {
            marketPlaceContract.methods
              .putItemToResell(
                planetRunnerAddress,
                tokenId,
                Web3.utils.toWei(String(sellPrice), 'ether')
              )
              .send({ from: currentAccount, value: listingFee, gas: 8000000 })
              .on('receipt', function () {
                router.reload();
              });
          } else {
            marketPlaceContract.methods
              .updateMarketItemPrice(
                tokenId,
                Web3.utils.toWei(String(sellPrice), 'ether')
              )
              .send({ from: currentAccount, value: listingFee })
              .on('receipt', function () {
                router.reload();
              });
          }
        }
      } else {
        message.error('You are not Item Owner.');
        setOpenModal(false);
      }
    }
  };

  const handleSellPrice = async (value: number) => {
    if (Number(value) <= 0) {
      await setAlertText(true);
      return false;
    }

    if (!nftDetail?.sold) {
      if (Number(price) > 0 && Number(value) >= Number(price)) {
        await setAlertText(true);
        return false;
      }
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
                <Link href="/">{collectionName}</Link>
              </Title>
              <Title level={2} className="mt-0 dark:text-white">
                {`Runner #${nftDetail?.tokenId}`}
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
                    sold={nftDetail?.sold}
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
                    defaultActiveKey={['1', '2', '3', '4']}
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
                      {description || (
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            By Planet Runner
                          </span>
                          <span className="mt-2">
                            This mystery box contains an NFT Sneaker of random
                            quality and type. Used in the Planet Runner mobile
                            app, it facilitates the player’s ability to move to
                            earn through walking, jogging or running outdoors.
                          </span>
                        </div>
                      )}
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
                      {attributes ? (
                        <div className="w-full h-20 grid grid-cols-3 gap-3">
                          {attributes.map((prop: any, i: number) => (
                            <div
                              key={i}
                              className="border border-info rounded-md flex flex-col items-center justify-evenly bg-info bg-opacity-10"
                            >
                              <span className="flex justify-center text-info text-xs font-medium">
                                {prop.trait_type}
                              </span>
                              <span className="flex justify-center text-black text-md font-semibold dark:text-white">
                                {prop.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty />
                      )}
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
                      <span>
                        These mystery boxes each contain an NFT Sneaker of
                        random quality and type. Used in the Planet Runner
                        mobile app, these NFT Sneakers facilitate the player’s
                        ability to move to earn through walking, jogging or
                        running outdoors.
                      </span>
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
                      {nftDetail ? (
                        <ul className="w-full">
                          <Link href={metadataUrl}>
                            <a target="_black">
                              <li className="flex justify-around">
                                <span className="w-1/2 font-semibold">
                                  TokenId
                                </span>
                                <span className="w-1/2 flex justify-end">
                                  {nftDetail.tokenId}
                                </span>
                              </li>
                            </a>
                          </Link>
                          <li className="flex justify-around">
                            <span className="w-1/2 font-semibold">Creator</span>
                            <span className="w-1/2 flex justify-end">
                              {shortAddress(nftDetail.creator as string) || '-'}
                            </span>
                          </li>
                          <li className="flex justify-around">
                            <span className="w-1/2 font-semibold">Seller</span>
                            <span className="w-1/2 flex justify-end">
                              {shortAddress(nftDetail.seller as string) || '-'}
                            </span>
                          </li>
                          <li className="flex justify-around">
                            <span className="w-1/2 font-semibold">Owner</span>
                            <span className="w-1/2 flex justify-end">
                              {isOwner
                                ? `you`
                                : shortAddress(nftDetail.owner as string) ||
                                  '-'}
                            </span>
                          </li>
                        </ul>
                      ) : (
                        <Empty />
                      )}
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
