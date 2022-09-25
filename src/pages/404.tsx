import { Button } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Custom404: NextPage = ({}) => {
  const router = useRouter();

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center mt-32">
      <main className="flex flex-col items-center">
        <div className="text-9xl text-grey1 font-black">404</div>
        <div className="text-3xl font-bold mt-10">This page is lost.</div>
        <div className="flex flex-col items-center text-xl text-black opacity-60 font-medium mt-5">
          <p>We`ve explored deep and wide,</p>
          <p>but we can`t find the page you were looking for.</p>
        </div>
        <div className="mt-10">
          <Button
            type="primary"
            onClick={handleBackHome}
            className="h-12 bg-info border-info"
          >
            Navigate back home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Custom404;
