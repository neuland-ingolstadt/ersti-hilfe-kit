import React from 'react'
import dynamic from 'next/dynamic'

const TourMap = dynamic(() => import('../components/TourMap'), { ssr: false })

export default function Map () {
  // the page contents are in a separate component
  // because Leaflet can't handle SSR
  return <TourMap />
}
