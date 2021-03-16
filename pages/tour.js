import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ReactMarkdown from 'react-markdown'

import styles from '../styles/Map.module.css'

import data from '../data/tour.json'

const MapContainer = dynamic(() => import('react-leaflet').then(x => x.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(x => x.TileLayer), { ssr: false })
const ZoomControl = dynamic(() => import('react-leaflet').then(x => x.ZoomControl), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(x => x.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(x => x.Popup), { ssr: false })

const ICONS = {
  gastro: '/pin_green.svg',
  hochschule: '/pin_indigo.svg',
  chill: '/pin_orange.svg',
  sehenswuerdig: '/pin_red.svg',
  nuetzlich: '/pin_gray.svg'
}

function getGoogleMapsLink (lat, lon) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}

export default function Map () {
  const [icons, setIcons] = useState({})
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    const { icon } = require('leaflet')
    const icons = {}
    for (const category of Object.keys(ICONS)) {
      icons[category] = icon({
        iconUrl: ICONS[category],
        iconSize: [20, 35],
        iconAnchor: [10, 35]
      })
    }
    setIcons(icons)
  }, [])

  return (
    <Container className={styles.container}>
      <Head>
        <title>Stadt- und Campusführung</title>
      </Head>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Virtuelle Stadt- und Campusführung</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Klicke auf eine Markierung, um mehr über diesen Ort zu erfahren.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>

      <MapContainer
        center={[48.76415, 11.42434]}
        zoom={16}
        scrollWheelZoom={true}
        zoomControl={false}
        className={styles.mapContainer}
    >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>-Mitwirkende | <a href="https://neuland-ingolstadt.de/impressum.htm">Impressum</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />

        {data.map(elem =>
          <Marker
            key={elem.id}
            position={[elem.lat, elem.lon]}
            icon={icons[elem.category]}
          >
            <Popup
              maxWidth="auto"
              maxHeight="auto"
              className={styles.popup}
            >
              <h4 className={styles.popupHeading}>
                {elem.title}
              </h4>
              <div className={styles.popupDescription}>
                <ReactMarkdown>{elem.description}</ReactMarkdown>
              </div>
              <p>
                <a href={getGoogleMapsLink(elem.lat, elem.lon)} target="_blank" rel="noreferrer">In Google Maps öffnen</a>
              </p>
              {elem.video &&
                <video className={styles.popupVideo} controls>
                  <source src={elem.video} type="video/mp4" />
                </video>
              }
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Container>
  )
}
