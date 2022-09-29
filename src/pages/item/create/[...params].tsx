import { useEffect, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Title, Button } from '@components/atoms';
import { Divider, Upload, Input, Modal, Select, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  beforeUpload,
  extractMetadataUrl,
  getBase64,
  uploadStore
} from '@libs/client/utils';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { useRouter } from 'next/router';
import { CreateItemType, ItemType } from '@libs/client/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const requireClass = `after:content-['*'] after:ml-1 after:text-danger after:font-semibold`;
const sectionClass = `flex flex-col justify-start w-full mb-8`;
const titleClass = `text-sm font-bold mb-2`;
const messageClass = `text-xs font-semibold opacity-40 mb-2`;

const ItemCreate: NextPage<CreateItemType> = ({
  userContract,
  isUserLoggedIn,
  currentAccount,
  collections
}: CreateItemType | any) => {
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [supply, setSupply] = useState(1);
  const [collection, setCollection] = useState('');
  const [blockchain, setBlockchain] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const router = useRouter();

  const handleCancel = () => {
    setPreviewVisible(false);
    setImage(null);
  };

  const handlePreview = async (file: UploadFile<any>) => {
    let fileName: string,
      fileUrl: string,
      filePreview: string,
      fileTitle: string;

    fileName = file.name || '';
    fileUrl = file.url || '';
    filePreview = file.preview || '';
    if (!fileUrl && !filePreview) {
      const temp: String | unknown = await getBase64(file.originFileObj);
      filePreview = typeof temp !== 'string' ? '' : temp;
    }

    fileTitle = fileName || fileUrl?.substring(fileUrl.lastIndexOf('/') + 1);

    setPreviewImage(fileUrl || filePreview);
    setPreviewVisible(true);
    setPreviewTitle(fileTitle);
  };

  const handleChange = ({
    fileList: newFileList
  }: UploadChangeParam<UploadFile<any>> | any) => {
    if (newFileList.length === 0) {
      handleCancel();
      setFileList(newFileList);
      return;
    }
    const newFile = newFileList[newFileList.length - 1];
    if (newFile) {
      if (beforeUpload(newFile.type, newFile.size)) {
        setFileList(newFileList);
        setImage(newFile.originFileObj);
      } else {
        handleCancel();
      }
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleName = (event: any) => setName(event.target.value);
  const handleDescription = (event: any) => setDescription(event.target.value);
  const handleExternalUrl = (event: any) => setExternalUrl(event.target.value);
  const handleSupply = (value: number) => setSupply(value);
  const handleCollection = (value: string) => {
    setCollection(value);
  };
  const handleBlockchain = (value: string) => setBlockchain(value);
  const handleCreate = async () => {
    setSubmit(true);

    const item: ItemType = {
      image,
      name,
      description,
      external_link: externalUrl,
      supply,
      collection,
      blockchain
    };

    if (!loading) {
      const metadata: any = await uploadStore(item);
      userContract.methods
        .mintNFT(currentAccount, extractMetadataUrl(metadata.url), collection)
        .send({
          from: currentAccount
        })
        .once('receipt', (receipt: any) => {
          setSubmit(false);
          router.push('/mypage/1');
        });
    }
  };

  useEffect(() => {
    setBlockchain('ethereum');
    setCollection(collections[0]);
  }, []);

  useEffect(() => {
    if (submit || !currentAccount) {
      setLoading(true);
    } else {
      if (image && name) {
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [image, name, submit, currentAccount]);

  return (
    isUserLoggedIn && (
      <div>
        <div className="w-full h-full flex justify-center">
          <main className="flex flex-col items-start sm:w-1/2 md:w-2/5 w-2/3 py-11">
            <Title
              type="title-content"
              text="Create New Item"
              className="dark:text-white"
            />
            <section className={sectionClass}>
              <div className={`${titleClass} ${requireClass}`}>
                Image, Video, Audio, or 3D Model
              </div>
              <div className={messageClass}>
                File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                OGG, GLB, GLTF. Max size: 100 MB
              </div>
              <Upload
                action="/"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={1}
              >
                {uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="previewImage" className="w-full" src={previewImage} />
              </Modal>
            </section>
            <section className={sectionClass}>
              <div className={`${titleClass} ${requireClass}`}>Name</div>
              <div className="w-full">
                <Input
                  onChange={handleName}
                  placeholder="Item name"
                  className="rounded-xl dark:border-2 dark:bg-deepdark dark:text-grey1"
                />
              </div>
            </section>
            <section className={sectionClass}>
              <div className={titleClass}>External link</div>
              <div className={messageClass}>
                PlanetRunner will include a link to this URL on this item`s
                detail page, so that users can click to learn more about it. You
                are welcome to link to your own webpage with more details.
              </div>
              <div>
                <Input
                  placeholder="https://yoursite.io/item/123"
                  onChange={handleExternalUrl}
                  className="rounded-xl dark:border-2 dark:bg-deepdark dark:text-grey1"
                />
              </div>
            </section>
            <section className={sectionClass}>
              <div className={titleClass}>Description</div>
              <div className={messageClass}>
                The description will be included on the item`s detail page
                underneath its image. Markdown syntax is supported.
              </div>
              <div>
                <Input.TextArea
                  rows={4}
                  placeholder="Provide a detailed description of your item."
                  onChange={handleDescription}
                  className="rounded-xl dark:border-2 dark:bg-deepdark dark:text-grey1"
                />
              </div>
            </section>
            <section className={sectionClass}>
              <div className={titleClass}>Collection</div>
              <div className={messageClass}>
                This is the collection where your item will appear.
              </div>
              <div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select collection"
                  defaultValue={collections[0]}
                  onChange={handleCollection}
                >
                  {collections &&
                    collections.map((name: any, key: number) => (
                      <Select.Option key={`collection_${key}`} value={name}>
                        {name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </section>
            <section className={sectionClass}>
              <div className={titleClass}>Supply</div>
              <div className={messageClass}>
                The number of items that can be minted. No gas cost to you!
              </div>
              <div>
                <InputNumber
                  onChange={handleSupply}
                  placeholder="Selection collection"
                  min={1}
                  defaultValue={1}
                  className="rounded-xl dark:border-2 dark:bg-deepdark dark:text-grey1"
                />
              </div>
            </section>
            <section className={sectionClass}>
              <div className={titleClass}>Blockchain</div>
              <div>
                <Select
                  defaultValue="ethereum"
                  style={{ width: '100%' }}
                  onChange={handleBlockchain}
                >
                  <Select.Option key="blockchain_1" value="ethereum">
                    Ethereum
                  </Select.Option>
                  <Select.Option key="blockchain_2" value="solana" disabled>
                    Solana
                  </Select.Option>
                  <Select.Option key="blockchain_3" value="polygon" disabled>
                    Polygon
                  </Select.Option>
                  <Select.Option key="blockchain_4" value="klaytn" disabled>
                    Klaytn
                  </Select.Option>
                </Select>
              </div>
            </section>
            <Divider />
            <section className={`${sectionClass} mb-10`}>
              <Button
                type="primary"
                className="w-24 h-12"
                text="Create"
                disabled={loading}
                onClick={handleCreate}
              />
            </section>
          </main>
        </div>
      </div>
    )
  );
};

export default ItemCreate;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const networkId: string = query && query.params ? query.params[0] : '';
  const account: string = query && query.params ? query.params[1] : '';
  const user = await prisma.user.findFirst({
    where: {
      networkId,
      account
    }
  });

  if (user?.account !== account || user?.networkId !== networkId) {
    console.log('Incorrect Access!!');
    return {
      redirect: {
        permanent: false,
        destination: '/404'
      }
    };
  }

  let collections: string[];
  const collectionList = await prisma.collection.findMany({
    where: {
      networkId,
      account
    }
  });
  collections = collectionList.map(collection => collection.name);

  return {
    props: { collections }
  };
};
