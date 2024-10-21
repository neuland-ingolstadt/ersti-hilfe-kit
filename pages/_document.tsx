import { inter } from '@/pages/_app'
import { Html, Head, Main, NextScript } from 'next/document'

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
      <body className={`${inter.variable} font-sans`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
