import React, { useState, createRef } from 'react'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import ReactMarkdown from 'react-markdown'
import L from 'leaflet'
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhotoVideo
} from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/TourMap.module.css'

import data from '../data/tour.json'

const ICONS = {
  gastro: '/pin_green.svg',
  hochschule: '/pin_indigo.svg',
  chill: '/pin_orange.svg',
  sehenswuerdig: '/pin_red.svg',
  nuetzlich: '/pin_gray.svg'
}

const HEADINGS = {
  gastro: 'Bars & Cafés',
  hochschule: 'Hochschule',
  chill: 'Chillen',
  sehenswuerdig: 'Sehenswürdigkeiten',
  nuetzlich: 'Nützliches'
}

// use less padding on small devices
// because they do not have enough space to fit the popup plus the padding
const PADDING = window.matchMedia('(max-width: 768px)').matches ? 10 : 50

// use custom link implementation to set rel="noopener"
const COMPONENTS = {
  a (props) {
    return <a target="_blank" rel="noopener" {...props} />
  }
}

const categorizedData = data
  .map(elem => elem.category)
  .filter((v, i, a) => a.indexOf(v) === i)
  .map(category => {
    const items = data.map((elem, idx) => ({
      id: idx,
      ...elem
    }))
      .filter(elem => elem.category === category)
      .sort((a, b) => a.title.localeCompare(b.title))

    return { category, items }
  })

const icons = {}
for (const category of Object.keys(ICONS)) {
  icons[category] = L.icon({
    iconUrl: ICONS[category],
    iconSize: [20, 35],
    iconAnchor: [10, 35],
    popupAnchor: [0, -35]
  })
}

function getGoogleMapsLink (lat, lon) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}
function getAppleMapsLink (name, lat, lon) {
  return `https://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${lat},${lon}`
}
function getOSMLink (lat, lon) {
  return `https://www.openstreetmap.org/index.html?lat=${lat}&lon=${lon}&mlat=${lat}&mlon=${lon}&zoom=19&layers=M`
}

export default function TourMap () {
  const markerRefs = data.map(() => createRef())
  const [showModal, setShowModal] = useState(true)

  function openElem (idx) {
    const marker = markerRefs[idx].current
    if (marker) {
      marker.openPopup()
    }
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Virtuelle Stadt- und Campusführung</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Klicke auf eine Markierung, um mehr über diesen Ort zu erfahren.
            Viele der Orte haben auch ein kurzes Video.
          </p>
          <p>
            Die virtuelle Stadt- und Campusführung ist ein Projekt der <a href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung" target="_blank" rel="noreferrer">Fachschaft Informatik</a> in Kooperation mit <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt</a>.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
      <Container className={styles.container}>
        <div className={styles.sidebar}>
          <img
            className={styles.sidebarLogo}
            src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
            alt="Studierendenvertretung TH Ingolstadt"
          />

          {categorizedData.map(({ category, items }) =>
            <ListGroup key={category} variant="flush">
              <ListGroup.Item className={styles.sidebarHeading}>
                <img src={ICONS[category]} className={styles.sidebarPin} />
                {HEADINGS[category]}
              </ListGroup.Item>
              {items.filter(elem => !elem.hide).map(elem =>
                <ListGroup.Item key={elem.id} action onClick={() => openElem(elem.id)}>
                  {elem.title}
                  {elem.video && (
                    <div className={styles.sidebarVideoIcon}>
                      <FontAwesomeIcon icon={faPhotoVideo} className="text-muted" fixedWidth />
                    </div>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          )}
        </div>

        <MapContainer
          center={[48.76415, 11.42434]}
          zoom={16}
          scrollWheelZoom={true}
          zoomControl={false}
          // set tap=false to work around weird popup behavior on iOS
          // https://github.com/Leaflet/Leaflet/issues/3184
          tap={false}
          className={styles.mapContainer}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>-Mitwirkende | <a href="https://neuland-ingolstadt.de/impressum.htm">Impressum</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <ZoomControl position="bottomright" />

          {data.map((elem, idx) =>
            <Marker
              key={idx}
              position={[elem.lat, elem.lon]}
              icon={icons[elem.category]}
              ref={markerRefs[idx]}
            >
              <Popup
                maxWidth="auto"
                maxHeight="auto"
                className={styles.popup}
                autoPanPadding={[PADDING, PADDING]}
              >
                <h4 className={styles.popupHeading}>
                  {elem.title}
                </h4>
                <div className={styles.popupDescription}>
                  {navigator.language.startsWith('de')
                    ? <ReactMarkdown components={COMPONENTS}>{elem.description_de}</ReactMarkdown>
                    : <ReactMarkdown components={COMPONENTS}>{elem.description_en}</ReactMarkdown>
                  }
                </div>
                {elem.video &&
                  <video className={styles.popupVideo} poster={elem.poster} controls>
                    <source src={elem.video} type="video/mp4" />
                  </video>
                }
                <p>
                  Öffnen in{' '}
                  <a href={getOSMLink(elem.lat, elem.lon)} target="_blank" rel="noreferrer">OpenStreetMap</a>
                  {', '}
                  <a href={getGoogleMapsLink(elem.lat, elem.lon)} target="_blank" rel="noreferrer">Google Maps</a>
                  {', '}
                  <a href={getAppleMapsLink(elem.title, elem.lat, elem.lon)} target="_blank" rel="noreferrer">Apple Maps</a>
                </p>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Container>
    </>
  )
}
