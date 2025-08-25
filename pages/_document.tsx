import { Head, Html, Main, NextScript } from 'next/document'
import { inter } from '@/pages/_app'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Eine digitale O-Phase für die Erstis an der TH Ingolstadt."
        />
        <link
          rel="icon"
          href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
