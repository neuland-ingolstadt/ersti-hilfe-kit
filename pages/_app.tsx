import 'maplibre-gl/dist/maplibre-gl.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider } from '@/lib/providers/themeProvider'
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  )
}
