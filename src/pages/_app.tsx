import BaseLayout from '@components/layout';
import type { AppProps } from 'next/app';
import '../styles/style.scss';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </ThemeProvider>
  );
}

export default MyApp;

// import type { AppProps } from 'next/app';
// import '../styles/style.scss';
// import Link from 'next/link';

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <div>
//       <nav className="border-b p-6">
//         <p className="text-4xl font-bold">Planet Runner Marketplace</p>
//         <div className="flex mt-4">
//           <Link href="/">
//             <a className="mr-4 text-teal-400">Home</a>
//           </Link>
//           <Link href="/my-nfts">
//             <a className="mr-6 text-teal-400">My NFTs</a>
//           </Link>
//           <Link href="/my-listed-nfts">
//             <a className="mr-6 text-teal-400">My Listed NFTs</a>
//           </Link>
//         </div>
//       </nav>
//       <Component {...pageProps} />
//     </div>
//   );
// }

// export default MyApp;
