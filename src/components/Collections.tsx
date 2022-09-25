import { CollectionType } from '@libs/client/client';
import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Image from 'next/image';
import Link from 'next/link';

const Collections: CollectionType[] | any = ({
  collectionList
}: CollectionType[] | any) => {
  return (
    <ul className="w-[30rem] sm:w-full h-full flex flex-wrap">
      {collectionList?.length > 0 &&
        collectionList?.map((collection: any, key: number) => (
          <Link key={`link_${key}`} href={`/collection/${collection?.name}`}>
            <li
              key={`li_${key}`}
              className="flex flex-col shadow rounded-md w-[30rem] h-96 mb-5 sm:mr-5 dark:bg-dark"
            >
              <Card
                key={`card_${key}`}
                hoverable
                className="flex flex-col justify-between"
                style={{
                  width: '480px',
                  height: '280px'
                }}
                cover={
                  collection?.featuredImageUrl ? (
                    <Image
                      alt={collection?.name}
                      width="480"
                      height="280"
                      className="bg-fixed object-cover"
                      src={`https://ipfs.io/ipfs/${
                        collection?.featuredImageUrl?.split('//')[1]
                      }`}
                    />
                  ) : (
                    <Image
                      alt={collection?.name}
                      width="480"
                      height="280"
                      className="bg-fixed object-cover"
                      src={`https://ipfs.io/ipfs/${
                        collection?.logoImageUrl?.split('//')[1]
                      }`}
                    />
                  )
                }
              >
                <div className="flex">
                  <div className="relative left-0 -top-10 flex border-4 border-white shadow-md rounded-2xl dark:border-dark">
                    <Image
                      alt={collection?.name}
                      width="90"
                      height="90"
                      src={`https://ipfs.io/ipfs/${
                        collection?.logoImageUrl?.split('//')[1]
                      }`}
                      className="rounded-xl"
                    />
                  </div>
                  <Meta
                    title={
                      <span className="font-bold dark:text-white">
                        {collection?.name}
                      </span>
                    }
                    className="ml-5 mt-1"
                  />
                </div>
              </Card>
            </li>
          </Link>
        ))}
    </ul>
  );
};

export default Collections;
