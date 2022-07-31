import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Container, Navbar } from 'react-bootstrap'
import PropTypes from 'prop-types'
import styles from '../../styles/Scavenger.module.css'
import ScavengerDatabase from '../../lib/ScavengerDatabase'

export default function Scavenger ({ id, entry, error }) {
  const [score, setScore] = useState()

  useEffect(() => {
    async function update () {
      const db = new ScavengerDatabase()
      setScore(await db.getScore())
    }
    update()
  }, [])

  return (
    <>
      <Head>
        <title>Schnitzeljagd</title>
        <meta name="description" content="Eine digitale Schnitzeljagd für die Erstis an der TH Ingolstadt." />
        <link rel="icon" href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg" />
      </Head>

      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>
            <img
              src="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
              alt="Studierendenvertretung TH Ingolstadt"
              className={`d-inline-block align-top ${styles.logo}`}
            />{' '}
            Schnitzeljagd
          </Navbar.Brand>
          <Navbar.Text className="justify-content-end">
            <strong>Punkte:</strong>
            <> {score}</>
          </Navbar.Text>
        </Container>
      </Navbar>

      <Container className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Was ist das?
          </h1>
          <p>
            Das ist eine Campusführung in Form einer digitalen Schnitzeljagd, welche euch dabei helfen soll, eure neue Hochschule besser kennenzulernen.
          </p>
          <h2 className={styles.subtitle}>
            Wie mache ich mit?
          </h2>
          <p>
            Überall in der THI sind an interessanten Orten QR-Codes angebracht. Scanne diesen QR-Code, um Punkte gutgeschrieben zu bekommen. Die Personen, die am Ende die meisten Punkte haben, kriegen als Preis etwas THI Merch. Alle anderen haben zumindest etwas über ihre Hochschule gelernt. ;)
          </p>
          <p>
            Du hast aktuell <strong>{score || 0} Punkte</strong>.
          </p>
        </main>

        <footer className={styles.footer}>
          <p>
            <small>
              Erstellt und entwickelt von der <a href="https://studverthi.de" target="_blank" rel="noreferrer">Studierendenvertretung</a> und <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt.</a>
            </small>
          </p>
        </footer>
      </Container>
    </>
  )
}
Scavenger.propTypes = {
  id: PropTypes.string,
  entry: PropTypes.any,
  error: PropTypes.string
}
