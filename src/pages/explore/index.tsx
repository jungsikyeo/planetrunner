import type { NextPage } from 'next';
import { Typography, Tabs, Card } from 'antd';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Collections from '@components/Collections';
import {
  CollectionType,
  ExplorePropsType,
  ICollections
} from '@libs/client/client';

const { TabPane } = Tabs;
const { Title } = Typography;

const Explore: NextPage<ExplorePropsType> = ({
  network,
  currentAccount,
  isUserLoggedIn
}: ExplorePropsType) => {
  const [allList, setAllList] = useState<CollectionType[]>(ICollections);
  const [myList, setMyList] = useState<CollectionType[]>(ICollections);

  useEffect(() => {
    if (network) {
      const getAllCollection = async () => {
        await fetch('/api/collection/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            networkId: network.networkId
          })
        })
          .then(response => response.json().catch(() => {}))
          .then(async data => {
            if (data?.collections && data?.collections?.length > 0) {
              await Promise.all(
                data.collections
                  .filter((res: CollectionType) =>
                    res.logoImageMetadata?.startsWith('https://')
                  )
                  .map(
                    (res: CollectionType) =>
                      res.logoImageMetadata &&
                      Axios.get(res.logoImageMetadata).then(({ data }) => {
                        return Object.assign(res, { logoImageUrl: data.image });
                      })
                  )
              );

              await Promise.all(
                data.collections
                  .filter((res: CollectionType) =>
                    res.featuredImageMetadata?.startsWith('https://')
                  )
                  .map(
                    (res: CollectionType) =>
                      res.featuredImageMetadata &&
                      Axios.get(res.featuredImageMetadata).then(({ data }) => {
                        return Object.assign(res, {
                          featuredImageUrl: data.image
                        });
                      })
                  )
              );

              const myList = data.collections.filter((res: any) => {
                return res.account === currentAccount;
              });

              setAllList(data.collections);
              setMyList(myList);
            }
          })
          .catch(error => {
            console.log(error);
          });
      };
      getAllCollection();
    }
  }, [network, currentAccount]);

  return (
    <div className="w-full">
      <div className="w-full h-screen flex justify-start">
        <main className="w-full h-full flex flex-col p-14">
          <div className="flex sm:flex-row flex-col w-42 w">
            <div className="flex flex-col justify-center items-center mt-2 sm:mt-0">
              <Title level={1} className="dark:text-white">
                Explore collections
              </Title>
            </div>
          </div>
          <div className="w-full h-full mt-5">
            <div className="w-full h-auto flex justify-center sm:block sm:justify-start">
              <Tabs
                defaultActiveKey="1"
                className="w-full h-full text-base font-semibold dark:text-white"
              >
                <TabPane tab="All" key="1">
                  <Collections collectionList={allList} />
                </TabPane>
                {isUserLoggedIn && (
                  <TabPane tab="My collections" key="2">
                    {myList && myList.length > 0 && (
                      <Collections collectionList={myList} />
                    )}
                  </TabPane>
                )}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;
