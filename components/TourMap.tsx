import React, { useState, createRef, useMemo } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
const styles = {}
import Link from 'next/link'
import Image from 'next/image'

import Map, { Marker, Popup } from 'react-map-gl/maplibre'
import useMediaQuery from '@restart/hooks/useMediaQuery'
import { ImagePlay, MapPin, X } from 'lucide-react'
import { CityData } from '@/pages/tour/[city]'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const COLORS = {
  gastro: {
    fill: '#2ECC71',
    stroke: '#27AE60',
  },
  hochschule: {
    fill: '#3498DB',
    stroke: '#2980B9',
  },
  chill: {
    fill: '#F39C12',
    stroke: '#D35400',
  },
  sehenswuerdig: {
    fill: '#E74C3C',
    stroke: '#C0392B',
  },
  nuetzlich: {
    fill: '#BDC3C7',
    stroke: '#7F8C8D',
  },
}

const HEADINGS = {
  gastro: 'Bars & Cafés',
  hochschule: 'Hochschule',
  chill: 'Chillen',
  sehenswuerdig: 'Sehenswürdigkeiten',
  nuetzlich: 'Nützliches',
}

// use custom link implementation to open links in new tab
const COMPONENTS = {
  a(props) {
    return (
      <Link
        target="_blank"
        rel="noopener"
        {...props}
      />
    )
  },
}

function getGoogleMapsLink(lat: number, lon: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}
function getAppleMapsLink(name: string, lat: number, lon: number) {
  return `https://maps.apple.com/?q=${encodeURIComponent(
    name
  )}&ll=${lat},${lon}`
}
function getOSMLink(lat: number, lon: number) {
  return `https://www.openstreetmap.org/index.html?lat=${lat}&lon=${lon}&mlat=${lat}&mlon=${lon}&zoom=19&layers=M`
}

interface TourMapProps {
  center: [number, number]
  data: CityData
}

export default function TourMap({ center, data }: TourMapProps) {
  const [dialogOpen, showDialog] = useState(true)
  const [popup, setPopup] = useState(null)

  const mapRef = createRef()

  // use less padding on small devices
  // because they do not have enough space to fit the popup plus the padding
  const PADDING = useMediaQuery('(max-width: 768px)') ? 10 : 50

  const categorizedData = useMemo(() => {
    return data
      .map((elem) => elem.category)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((category) => {
        const items = data
          .map((elem, idx) => ({
            id: idx,
            ...elem,
          }))
          .filter((elem) => elem.category === category)
          .sort((a, b) => a.title.localeCompare(b.title))

        return { category, items }
      })
  }, [data])

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={showDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Virtuelle Stadt- und Campusführung</DialogTitle>
          </DialogHeader>

          <p>
            Klicke auf eine Markierung, um mehr über diesen Ort zu erfahren.
            Viele der Orte haben auch ein kurzes Video.
          </p>
          <p>
            Die virtuelle Stadt- und Campusführung ist ein Projekt der{' '}
            <a
              href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung"
              target="_blank"
              rel="noreferrer"
            >
              Fachschaft Informatik
            </a>{' '}
            in Kooperation mit{' '}
            <a
              href="https://neuland-ingolstadt.de"
              target="_blank"
              rel="noreferrer"
            >
              Neuland Ingolstadt
            </a>
            .
          </p>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => showDialog(false)}
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex h-screen w-screen flex-row gap-4">
        <div className="w-48">
          <Link href="/">
            <Image
              src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
              width={200}
              height={85}
              alt="Studierendenvertretung TH Ingolstadt"
            />
          </Link>

          <center>
            <Link href="../">
              <Button variant="secondary">Zurück</Button>
            </Link>
          </center>

          {categorizedData.map(({ category, items }) => (
            <ListGroup
              key={category}
              variant="flush"
            >
              <ListGroup.Item
                className={`${styles.sidebarHeading} d-flex align-items-center gap-1`}
              >
                <MapPin
                  size={20}
                  color={COLORS[category].stroke}
                  fill={COLORS[category].fill}
                />
                {HEADINGS[category]}
              </ListGroup.Item>
              {items
                .filter((elem) => !elem.hide)
                .map((elem) => (
                  <ListGroup.Item
                    key={elem.id}
                    action
                    onClick={() => {
                      mapRef.current.getMap().flyTo({
                        center: [elem.lon, elem.lat],
                        zoom: 16,
                        padding: PADDING,
                      })
                      setPopup(elem)
                    }}
                    className="d-flex align-items-center gap-1"
                  >
                    <span className="flex-grow-1">{elem.title}</span>
                    {elem.video && (
                      <ImagePlay
                        size={20}
                        className="text-muted"
                      />
                    )}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          ))}
        </div>

        <div>
          <Map
            ref={mapRef}
            reuseMaps
            mapStyle={`https://tile.neuland.app/styles/bright/style.json`}
            attributionControl={false}
            initialViewState={{
              latitude: center[0],
              longitude: center[1],
              zoom: 16,
            }}
            boxZoom={false}
            maxPitch={0}
            maxZoom={19}
            minZoom={12}
          >
            {data.map((elem, idx) => (
              <Marker
                key={idx}
                latitude={elem.lat}
                longitude={elem.lon}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  mapRef.current.getMap().flyTo({
                    center: [elem.lon, elem.lat],
                    zoom: 16,
                    padding: PADDING,
                  })
                  setPopup(elem)
                }}
              >
                <MapPin
                  size={24}
                  color={COLORS[elem.category].stroke}
                  fill={COLORS[elem.category].fill}
                />
              </Marker>
            ))}

            {popup && (
              <Popup
                longitude={popup.lon}
                latitude={popup.lat}
                closeButton={false}
                className={styles.popup}
                anchor="center"
                maxWidth="820px"
                onClose={() => setPopup(null)}
              >
                <h4 className="d-flex align-items-center gap-3">
                  <span className="flex-grow-1">{popup.title}</span>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setPopup(null)
                    }}
                  >
                    <X
                      size={20}
                      className="text-muted"
                    />
                  </Button>
                </h4>
                <div className={styles.popupDescription}>
                  <ReactMarkdown components={COMPONENTS}>
                    {navigator.language.startsWith('de')
                      ? popup.description_de
                      : popup.description_en}
                  </ReactMarkdown>
                </div>
                {popup.video && (
                  <video
                    className={styles.popupVideo}
                    poster={popup.poster}
                    controls
                  >
                    <source
                      src={popup.video}
                      type="video/mp4"
                    />
                  </video>
                )}
                <p>
                  Öffnen in{' '}
                  <a
                    href={getOSMLink(popup.lat, popup.lon)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    OpenStreetMap
                  </a>
                  {', '}
                  <a
                    href={getGoogleMapsLink(popup.lat, popup.lon)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Maps
                  </a>
                  {', '}
                  <a
                    href={getAppleMapsLink(popup.title, popup.lat, popup.lon)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apple Maps
                  </a>
                </p>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </>
  )
}
TourMap.propTypes = {
  center: PropTypes.array,
  data: PropTypes.array,
}
