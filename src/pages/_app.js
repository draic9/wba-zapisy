import '../styles/globals.css'
import '../styles/main.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/wba-favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}