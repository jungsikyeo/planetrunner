import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import matamask from '/public/metamask-icon.png';
import { Spin } from 'antd';
import { LoginPropsType } from '@libs/client/client';
import { useRouter } from 'next/router';

const Login: NextPage<LoginPropsType> = ({ connectWallet }: LoginPropsType) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMetamask = async () => {
    setLoading(true);
    const ifConnectWallet = await connectWallet();
    if (!ifConnectWallet) {
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <main className="m-10">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">Connect your wallet.</span>
          <span className="text-base font-medium mt-2">
            If you don`t have a wallet yet, you can select a provider and create
            one now.
          </span>
        </div>
        <ul className="w-full h-20 flex items-center mt-10 border border-grey3 rounded-lg">
          <li
            className={`w-full flex justify-between mx-5 my-2 hover:cursor-pointer ${
              loading ? `opacity-30` : ``
            }`}
            onClick={handleMetamask}
          >
            <div className="w-full flex ">
              <div className="flex items-center">
                <Image src={matamask} width="30" height="30" alt="metamask" />
              </div>
              <div className="flex items-center ml-5 text-base font-semibold ">
                Metamask
              </div>
            </div>
            <div className="bg-info rounded-xl flex justify-center items-center">
              <span className="text-white font-semibold p-2">Popular</span>
            </div>
            <Spin
              spinning={loading}
              className="flex justify-center items-center ml-5"
            ></Spin>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default Login;
