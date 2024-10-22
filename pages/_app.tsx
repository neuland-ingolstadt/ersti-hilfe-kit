import React from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/lib/providers/themeProvider'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  )
}
