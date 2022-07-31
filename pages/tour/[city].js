import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/dist/client/router'

const TourMap = dynamic(() => import('../../components/TourMap'), { ssr: false })

const data = {
  ingolstadt: require('../../data/tour/ingolstadt.json'),
  neuburg: require('../../data/tour/neuburg.json')
}

const centers = {
  ingolstadt: [48.76415, 11.42434],
  neuburg: [48.73719, 11.18038]
}

export default function Map () {
  const router = useRouter()
  const { city } = router.query

  // the page contents are in a separate component
  // because Leaflet can't handle SSR
  return (
    <>
      <Head>
        <title>Virtuelle Stadt- und Campusführung</title>
        <meta name="description" content="Eine virtuelle Stadt- und Campusführung für die Erstis an der TH Ingolstadt." />
        <link rel="icon" href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg" />
      </Head>

      <TourMap center={centers[city]} data={data[city]} />
    </>
  )
}
