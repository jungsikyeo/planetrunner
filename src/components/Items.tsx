import { ItemType } from '@libs/client/client';
import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Link from 'next/link';

const Items: ItemType[] | any = ({ itemList }: ItemType[] | any) => {
  return (
    <ul className="w-64 sm:w-full h-full flex flex-wrap">
      {itemList?.map((myNft: ItemType, key: number) => (
        <Link key={`link_${key}`} href={`/item/detail/${myNft.nftTokenId}`}>
          <li
            key={`li_${key}`}
            className="flex flex-col shadow rounded-md w-52 h-72 mb-5 sm:mr-5"
          >
            <Card
              key={`card_${key}`}
              hoverable
              className="w-full h-full flex flex-col justify-between dark:bg-dark dark:border-dark dark:hover:bg-opacity-70 dark:hover:border-grey2"
              cover={
                <div className="overflow-hidden">
                  <img
                    alt={myNft.name}
                    width="100%"
                    height="100%"
                    className="hover:scale-110 transition-all"
                    src={myNft.imageURL}
                  />
                </div>
              }
            >
              <Meta
                title={<span className="dark:text-white">{myNft.name}</span>}
                description={
                  <span className="dark:text-grey2">
                    {myNft.collection || 'default'}
                  </span>
                }
                className="dark:text-white"
              />
            </Card>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Items;
