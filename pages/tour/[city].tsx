import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import INGOLSTADT from '@/data/tour/ingolstadt.json'
import NEUBURG from '@/data/tour/neuburg.json'
import { GetStaticProps } from 'next'

const TourMap = dynamic(() => import('../../components/TourMap'), {
  ssr: false,
})

type Cities = 'ingolstadt' | 'neuburg'
type City = keyof typeof CENTERS
export type CityData = typeof INGOLSTADT | typeof NEUBURG

const CENTERS: Record<Cities, [number, number]> = {
  ingolstadt: [48.76415, 11.42434],
  neuburg: [48.73719, 11.18038],
}

interface MapProps {
  city: City
  data: CityData
}

export default function Map({ city, data }: MapProps) {
  return (
    <>
      <Head>
        <title>Virtuelle Stadt- und Campusführung</title>
        <meta
          name="description"
          content="Eine virtuelle Stadt- und Campusführung für die Erstis an der TH Ingolstadt."
        />
      </Head>

      <TourMap
        center={CENTERS[city]}
        data={data}
      />
    </>
  )
}

export const getStaticPaths = async () => {
  return {
    paths: Object.keys(CENTERS).map((city) => ({
      params: { city },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !('city' in params)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      city: params.city,
      data: params.city === 'ingolstadt' ? INGOLSTADT : NEUBURG,
    },
  }
}
