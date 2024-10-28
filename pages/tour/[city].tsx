import React from 'react'
import Head from 'next/head'

import INGOLSTADT from '@/data/tour/ingolstadt.json'
import NEUBURG from '@/data/tour/neuburg.json'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'

const TourMap = dynamic(() => import('@/components/tour/tourMap'), {
  ssr: false,
})
export interface TourData {
  title: string
  description_de?: string
  description_en?: string
  category: string
  video?: string
  poster?: string
  lat: number
  lon: number
  hide?: boolean
}

export type City = 'ingolstadt' | 'neuburg'

const CENTERS: Record<City, [number, number]> = {
  ingolstadt: [48.76415, 11.42434],
  neuburg: [48.73719, 11.18038],
}

interface MapProps {
  city: City
  data: TourData[]
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
