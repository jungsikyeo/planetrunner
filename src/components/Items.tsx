import { INft } from '@libs/client/client';
import { extractMetadataUrl } from '@libs/client/utils';
import { Button, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Link from 'next/link';
import Web3 from 'web3';
import { ShoppingCartOutlined } from '@ant-design/icons';

const Items: INft[] | any = ({ itemList, sellMode }: INft[] | any) => {
  return (
    <ul className="w-64 sm:w-full h-full flex flex-wrap">
      {itemList?.map((myNft: INft, key: number) => (
        <Link key={`link_${key}`} href={`/item/detail/${myNft.tokenId}`}>
          <li
            key={`li_${key}`}
            className="flex flex-col shadow rounded-md w-52 h-80 mb-5 sm:mr-5 group"
          >
            <Card
              key={`card_${key}`}
              hoverable
              className={`w-full h-full flex flex-col justify-between dark:bg-dark dark:border-none ${
                sellMode && `group-hover:opacity-30`
              }`}
              cover={
                <div className="overflow-hidden">
                  <img
                    alt={myNft.name as string}
                    width="100%"
                    height="100%"
                    className="group-hover:scale-110 transition-all"
                    src={extractMetadataUrl(myNft.image as string)}
                  />
                </div>
              }
            >
              <Meta
                title={
                  <span className="w-full dark:text-white">{`Runner #${myNft.tokenId}`}</span>
                }
                description={
                  <div>
                    <span className="text-xs dark:text-white">Price</span>
                    <div className="flex items-center ml-2">
                      <svg
                        width="13"
                        height="20"
                        viewBox="0 0 33 53"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z"
                          fill="#343434"
                        />
                        <path
                          d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z"
                          fill="#8C8C8C"
                        />
                        <path
                          d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z"
                          fill="#3C3C3B"
                        />
                        <path
                          d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z"
                          fill="#8C8C8C"
                        />
                        <path
                          d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z"
                          fill="#141414"
                        />
                        <path
                          d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z"
                          fill="#393939"
                        />
                      </svg>
                      <span className="ml-2 text-lg dark:text-white">
                        {Web3.utils.fromWei(myNft.price as string, 'ether') ||
                          '0'}
                      </span>
                    </div>
                  </div>
                }
                className="min-w-full dark:text-white"
              />
            </Card>
            {sellMode && (
              <div className="w-52 h-80 absolute hidden group-hover:block group-hover:cursor-pointer">
                <div className="w-full h-full flex items-center justify-center">
                  <Button className="font-bold flex items-center bg-black text-white dark:bg-white dark:text-black">
                    <ShoppingCartOutlined />
                    <span>Buy now</span>
                  </Button>
                </div>
              </div>
            )}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Items;
