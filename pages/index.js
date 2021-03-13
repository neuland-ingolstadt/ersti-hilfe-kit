import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faMapSigns
} from '@fortawesome/free-solid-svg-icons'
import {
  faDiscord
} from '@fortawesome/free-brands-svg-icons'

import calendar from '../data/calendar.json'
import styles from '../styles/Home.module.css'

export default function Home () {
  return (
    <Container className={styles.container}>
      <Head>
        <title>Orientierungsphase</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img
        src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
        alt="Studierendenvertretung TH Ingolstadt"
        className={styles.logo}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Digitale Orientierungsphase
        </h1>

        <p>
          Willkommen an der Technischen Hochschule Ingolstadt!
        </p>

        <p>
          Um euch die Ankunft in Ingolstadt und den Studienbeginn etwas angenehmer zu gestalten, haben wir entschlossen, eine digitale O-Phase zu erproben. Wir hoffen, eure Zeit an unserer Hochschule damit etwas angenehmer gestalten zu können.
        </p>

        <p>
          &ndash; Eure Fachschaft Informatik &lt;3
        </p>

        {calendar && calendar.length > 0 &&
          <>
            <h2 className={styles.subtitle}>
              <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
              <> Veranstaltungen</>
            </h2>

            <div className={styles.calendar}>
              {calendar.map((event, idx) =>
                <p key={idx}>
                  <div className={styles.calendarTitle}>{event.title}</div>
                  <div className={styles.calendarDate}>am {new Date(event.date).toLocaleString()}</div>
                  <div className={styles.calendarDescription}>{event.description}</div>
                </p>
              )}
            </div>
          </>
        }

        <hr />

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faDiscord} fixedWidth />
          <> Discord-Server der Fakultät Informatik</>
        </h2>

        <p>
          <a href="https://discord.gg/pTvQEZpga7" target="_blank" rel="noreferrer">
            <Button variant="primary">
              Discord-Server beitreten
            </Button>
          </a>
        </p>

        <hr />

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faMapSigns} fixedWidth />
          <> Virtuelle Stadt- und Campusführung</>
        </h2>

        <Link href="/tour">
          <Button variant="primary">
            Stadt- und Campusführung öffnen
          </Button>
        </Link>
      </main>

      <hr />

      <footer className={styles.footer}>
        <p>
          Feedback nehmen wir gerne via Discord entgegen.
        </p>
        <p>
          Ein Projekt der <a href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung" target="_blank" rel="noreferrer">Fachschaft Informatik</a> und von <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt e.V.</a>
          <> &ndash; </>
          <a href="https://neuland-ingolstadt.de/impressum.htm" target="_blank" rel="noreferrer">Impressum und Datenschutz</a>
        </p>
      </footer>
    </Container>
  )
}
