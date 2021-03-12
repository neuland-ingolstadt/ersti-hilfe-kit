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
        src="https://www.thi.de/fileadmin/daten/hkom/StudentischeVereine_Aktivitaeten/Logo_Studierendenvertretung_final_CMYK.png"
        alt="Studierendenvertretung TH Ingolstadt"
        className={styles.logo}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Willkommen an der Technischen Hochschule Ingolstadt
        </h1>

        <p>
          Bavaria ipsum dolor sit amet da, hog di hi Xaver des is a gmahde Wiesn, Schorsch i hob di liab Prosd zwoa a Prosit der Gmiadlichkeit bittschön. Hob Musi Baamwach dahoam, hawadere midananda weida Wiesn Bradwurschtsemmal measi sei.
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

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faDiscord} fixedWidth />
          <> Discord-Server</>
        </h2>

        <p>
          Um dem Stillstand des Studentenlebens entgegenzuwirken, haben wir uns als Fachschaft dazu entschieden das ganze irgendwie virtuell zu gestalten und haben einen Discord-Server für die Fakultät Informatik erstellt.
          Dort könnt ihr euch kennenlernen und austauschen.
          Also gesellt euch zu uns, wir freuen uns auf euch!
        </p>

        <p>
          <a href="https://discord.gg/pTvQEZpga7" target="_blank" rel="noreferrer">
            <Button variant="primary">
              Discord-Server beitreten
            </Button>
          </a>
        </p>

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faMapSigns} fixedWidth />
          <> Stadt- und Campusführung</>
        </h2>
        <p>
          Anstelle euch persönlich durch die Hochschule zu führen, haben wir euch die Highlights unserer Hochschule und unserer Stadt
          auf einer Karte zusammengestellt und kurze Videos gedreht, um sie euch näher zu bringen.
        </p>
        <Link href="/tour">
          <Button variant="primary">
            Virtuelle Stadt- und Campusführung öffnen
          </Button>
        </Link>
      </main>

      <footer className={styles.footer}>
        <p>
          Ein Projekt der <a href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung" target="_blank" rel="noreferrer">Fachschaft Informatik</a> und von <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt e.V.</a>
        </p>
        <p>
          <a href="https://neuland-ingolstadt.de/impressum.htm" target="_blank" rel="noreferrer">Impressum und Datenschutz</a>
        </p>
      </footer>
    </Container>
  )
}
