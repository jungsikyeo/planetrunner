import { Modal } from '@components/atoms';
import {
  Card,
  Image,
  Space,
  Typography,
  Input,
  Button,
  InputNumber,
  Radio,
  Form
} from 'antd';
import { AccountBookOutlined, SendOutlined } from '@ant-design/icons';
import { CurrentPriceOwnerType } from '@libs/client/client';

const { Title, Text } = Typography;

const CurrentPriceOwner: CurrentPriceOwnerType | any = ({
  price,
  setAddress,
  openModal,
  setOpenModal,
  name,
  imageUrl,
  alertText,
  handleSell,
  handleSendTransfer,
  handleSellPrice,
  handleListing
}: CurrentPriceOwnerType) => {
  return (
    <Card
      title={
        ''
        // <>
        //   <ClockCircleOutlined /> Sale ends August 16, 2022 at
        //   2:32am GMT+9
        // </>
      }
      className="rounded-lg dark:bg-dark dark:border-grey3 dark:border-opacity-10"
    >
      <Space
        direction="vertical"
        style={{ width: '100%' }}
        className="dark:bg-dark"
      >
        <Text type="secondary" className="dark:text-white">
          Current price
        </Text>
        <Space className="h-12">
          <div className="h-full flex items-center">
            <svg
              width="23"
              height="30"
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
          </div>
          <Title
            level={2}
            className="h-full flex justify-center mb-0 dark:text-white"
          >
            {Number(price) === 0 ? `-` : price}
          </Title>
        </Space>
        <Input
          placeholder="e.g. 0x1ed3... or destination.eth"
          onChange={event => {
            setAddress(event.target.value);
          }}
          className="rounded-xl bg-light dark:border-2 dark:bg-dark dark:border-grey1 dark:text-grey1"
        />
        <span className="flex justify-center items-center text-xs font-semibold -mt-1 mb-1 dark:text-white">{`"${name}" will be transferred to ...`}</span>
        <Button
          type="primary"
          size="large"
          style={{ width: '100%' }}
          onClick={handleSendTransfer}
          className="flex items-center justify-center"
        >
          <SendOutlined />
          <span>Transfer</span>
        </Button>
        {Number(price) === 0 ? (
          <Button
            size="large"
            style={{ width: '100%' }}
            onClick={handleSell}
            className="flex items-center justify-center bg-info border-info text-white"
          >
            <AccountBookOutlined />
            <span>Sell</span>
          </Button>
        ) : (
          <Button
            size="large"
            style={{ width: '100%' }}
            onClick={handleSell}
            className="flex items-center justify-center bg-info border-info text-white"
          >
            <AccountBookOutlined />
            <span>Lower price</span>
          </Button>
        )}

        <Modal
          title="Sell Item"
          visible={openModal}
          onToggle={() => setOpenModal(!openModal)}
        >
          <Form layout="vertical">
            <Form.Item label={<span className="dark:text-white">name</span>}>
              <Image
                src={imageUrl}
                alt={`${name}`}
                width="50%"
                preview={false}
              />
            </Form.Item>
            <Form.Item label={<span className="dark:text-white">Type</span>}>
              <Radio.Group value="Fixed">
                <Radio.Button value="Fixed">Fixed</Radio.Button>
                <Radio.Button value="Auction" disabled>
                  Auction
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={<span className="dark:text-white">Price</span>}>
              <InputNumber
                placeholder="Amount"
                max={Number(price) === 0 ? undefined : Number(price)}
                defaultValue={Number(price) === 0 ? 0.001 : Number(price)}
                step="0.001"
                addonAfter="ETH"
                stringMode
                onChange={handleSellPrice}
              />
              <div
                className={`text-danger text-xs mt-1 ${
                  alertText ? `block` : `hidden`
                }`}
              >
                The new sale price must be lower than the current price. If you
                need to set a higher price, cancel the listing and re-list.
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleListing}
                disabled={alertText}
                className={`mt-5 ${
                  !alertText ? `bg-info text-white border-info` : ``
                }`}
              >
                Complete listing
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
};

export default CurrentPriceOwner;
