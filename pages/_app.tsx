import 'maplibre-gl/dist/maplibre-gl.css'
import '@/styles/globals.css'
import { AptabaseProvider } from '@aptabase/react'
import type { AppProps } from 'next/app'

import { ThemeProvider } from '@/lib/providers/themeProvider'
import { Inter as GoogleFont } from 'next/font/google'
import { cn } from '@/lib/utils'

const font = GoogleFont({
  subsets: ['latin'],
  display: 'swap',
})

const appKey = process.env.NEXT_PUBLIC_APTABASE_KEY || ''
const appVersion = process.env.NEXT_PUBLIC_VERSION || 'staging'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AptabaseProvider
      appKey={appKey}
      options={{
        appVersion,
        isDebug: process.env.NODE_ENV !== 'production',
        host: 'https://analytics.neuland.app',
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
      >
        <main className={cn(font.className, 'font-sans')}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </AptabaseProvider>
  )
}
