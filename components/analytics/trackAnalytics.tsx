import { useAptabase } from '@aptabase/react'
import { useRouter } from 'next/router'
import { useReportWebVitals } from 'next/web-vitals'
import { useEffect } from 'react'

export default function TrackAnalytics() {
  const router = useRouter()
  const { trackEvent } = useAptabase()

  useReportWebVitals((metric) => {
    trackEvent('Web Vitals', JSON.parse(JSON.stringify(metric)))
  })

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackEvent('Page View', { page: url })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    handleRouteChange(router.asPath)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, trackEvent, router.asPath])

  return null
}
