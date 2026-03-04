import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700,800,900|Bebas+Neue:400,500,600,700,800,900&amp;subset=latin" />
                <link rel="icon" href="/wba-favicon.ico" />
            </Head>
            <body className="antialiased bg-body text-body font-body">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
