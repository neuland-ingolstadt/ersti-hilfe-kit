import React from 'react'
import Head from 'next/head'
import { Accordion, Container, Navbar } from 'react-bootstrap'
import styles from '../../styles/Scavenger.module.css'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import rawData from '../../data/guide/studies.json'
import AccordionItem from 'react-bootstrap/AccordionItem'
import AccordionHeader from 'react-bootstrap/AccordionHeader'
import AccordionBody from 'react-bootstrap/AccordionBody'

export default function Studies () {
  return (
    <>
      <Head>
        <title>Studienguide</title>
        <meta name="description" content="Ein digitales Guide für die Erstis an der TH Ingolstadt."/>
        <link rel="icon" href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"/>
      </Head>

      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>
            <img
              src="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
              alt="Studierendenvertretung TH Ingolstadt"
              className={`d-inline-block align-top ${styles.logo}`}
            />{' '}
            Studienguide
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className={styles.container}>
        <main className={styles.main}>
          <h2 className={styles.title}>
            Dein Studium
          </h2>

          Der klare Unterschied zwischen Schule und Studium ist, dass man sich selbst darum kümmern muss, alle
          wichtigen Informationen zu erhalten. Sehr viele Informationen werden an das E-Mail-Postfach geschickt,
          welches jeder Studierende zu Beginn seines Studiums erhält.
          Daher ist es ratsam, dieses regelmäßig zu überprüfen oder direkt auf das private E-Mail-Postfach umzuleiten.
          <br/><br/>
          Bei Fragen, die man selbst nicht genau zuordnen kann, ist es meist der beste Weg auf die Professoren oder
          Deine Fachschaft zuzugehen. Meist wissen sie die Antwort und wenn nicht können sie einen in den meisten Fällen
          weitervermitteln.
          Auch das Dekanat der Fakultät ist eine gute Anlaufstelle. Solltet ihr ein Auslandssemester planen,
          Beratung rund um Prüfungen und Studium brauchen oder etwas unangebrachtes melden wollen haben wir auch einmal
          die
          Ansprechpartner:innen auf dieser Seite zusammengeführt.
          <br/><br/>
          <b>Wichtig! </b> - Termine und Noten werden meist nur noch auf elektronischem Wege bekannt gegeben.

          <hr/>

          <Accordion>
          {rawData.map((item) =>
            <AccordionItem eventKey={item.title} key={item.title}>
              <AccordionHeader>{item.title}</AccordionHeader>
              <AccordionBody>
                {item.content.map((content) =>
                  <AccordionItem eventKey={content.title} key={content.title}>
                    <AccordionHeader>{content.title}</AccordionHeader>
                    <AccordionBody>{content.content}</AccordionBody>
                  </AccordionItem>
                )}
              </AccordionBody>
            </AccordionItem>
          )}
          </Accordion>
          <hr/>

          <h2 className={styles.subtitle}>
            Weiterführende Seiten:
          </h2>

          <p>
            <Link href="/guide/life">
              <Button variant="primary">
                Dein Studierendenleben
              </Button>
            </Link>
          </p>

          <p>
            <Link href="/guide/studver">
              <Button variant="primary">
                Deine Studierendenvertretung
              </Button>
            </Link>
          </p>

          <p>
            <Link href="/guide/campus">
              <Button variant="primary">
                Dein Campus
              </Button>
            </Link>
          </p>

          <p>
            <Link href="../">
              <Button variant="info">
                Zurück
              </Button>
            </Link>
          </p>

        </main>

        <footer className={styles.footer}>
          <p>
            <small>
              Erstellt und entwickelt von der <a href="https://studverthi.de" target="_blank"
                                                 rel="noreferrer">Studierendenvertretung</a> und <a
              href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt.</a>
            </small>
          </p>
        </footer>
      </Container>
    </>
  )
}
