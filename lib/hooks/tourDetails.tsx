import type { TourData } from '@/pages/tour/[city]'
import { useMemo } from 'react'

export function useTourDetails(tour: TourData | undefined) {
  const osmLink = useMemo(() => {
    if (!tour) return ''

    return `https://www.openstreetmap.org/index.html?lat=${tour.lat}&lon=${tour.lon}&mlat=${tour.lat}&mlon=${tour.lon}&zoom=19&layers=M`
  }, [tour])

  const googleMapsLink = useMemo(() => {
    if (!tour) return ''

    return `https://www.google.com/maps/search/?api=1&query=${tour.lat},${tour.lon}`
  }, [tour])

  const appleMapsLink = useMemo(() => {
    if (!tour) return ''

    return `https://maps.apple.com/?q=${encodeURIComponent(tour.title)}&ll=${tour.lat},${tour.lon}`
  }, [tour])

  const description = useMemo(() => {
    if (!tour) return ''

    const isGerman = navigator.language.toLowerCase().startsWith('de')

    const description = isGerman ? tour.description_de : tour.description_en

    return description ?? ''
  }, [tour])

  return { osmLink, googleMapsLink, appleMapsLink, description }
}
