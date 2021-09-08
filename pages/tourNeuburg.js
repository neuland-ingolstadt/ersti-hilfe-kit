import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const TourMap = dynamic(() => import('../components/TourMapNeuburg'), { ssr: false })

export default function Map () {
  // the page contents are in a separate component
  // because Leaflet can't handle SSR
  return (
    <>
      <Head>
        <title>Virtuelle Stadt- und Campusführung - Campus Neuburg</title>
        <meta name="description" content="Eine virtuelle Stadt- und Campusführung für die Erstis an der TH Ingolstadt - Campus Neuburg." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TourMap />
    </>
  )
}
