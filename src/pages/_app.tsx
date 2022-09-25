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
