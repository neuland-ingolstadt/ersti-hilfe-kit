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
        <title>Digitale O-Phase</title>
        <meta name="description" content="Eine digitale O-Phase für die Erstis an der TH Ingolstadt." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img
        src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
        alt="Studierendenvertretung TH Ingolstadt"
        className={styles.logo}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Digitale O-Phase
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

        <hr />

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faMapSigns} fixedWidth />
          <> Virtuelle Stadt- und Campusführung</>
        </h2>

        <p>
          Eine virtuelle Stadt- und Campusführung als interaktive Karte, damit ihr die Stadt und unsere Hochschule selbst erkunden könnt.
        </p>

        <Link href="/tour">
          <Button variant="primary">
            Stadt- und Campusführung öffnen
          </Button>
        </Link>

        <hr />

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faDiscord} fixedWidth />
          <> Discord-Server der Fakultät Informatik</>
        </h2>

        <p>
          Ein Discord-Server, um uns auch in Zeiten von Kontaktbeschränkungen etwas zusammenzubringen.
        </p>

        <a href="https://discord.gg/pTvQEZpga7" target="_blank" rel="noreferrer">
          <Button>
            Discord-Server beitreten
          </Button>
        </a>

        {calendar && calendar.length > 0 &&
          <>
            <hr />

            <h2 className={styles.subtitle}>
              <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
              <> Veranstaltungen</>
            </h2>

            <ul className={styles.calendar}>
              {calendar.map((event, idx) =>
                <li key={idx}>
                  <div className={styles.calendarTitle}>{event.title}</div>
                  <div className={styles.calendarDate}>am {new Date(event.date).toLocaleString()}</div>
                  <div className={styles.calendarDescription}>{event.description}</div>
                </li>
              )}
            </ul>
          </>
        }

        <hr />
      </main>

      <footer className={styles.footer}>
        <p>
          Ein Projekt der <a href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung" target="_blank" rel="noreferrer">Fachschaft Informatik</a> in Kooperation mit <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt e.V.</a>
        </p>
        <p>
          Wir würden uns über euer Feedback freuen &ndash; entweder über Discord oder <a href="mailto:info@neuland-ingolstadt.de">per E-Mail</a>.
        </p>
        <p>
          <a href="https://github.com/neuland-ingolstadt/orientierungsphase" target="_blank" rel="noreferrer">Quellcode</a>
          <> &ndash; </>
          <a href="https://neuland-ingolstadt.de/impressum.htm" target="_blank" rel="noreferrer">Impressum und Datenschutz</a>
        </p>
      </footer>
    </Container>
  )
}
