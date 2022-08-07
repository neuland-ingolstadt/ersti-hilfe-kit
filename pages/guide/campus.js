import React from 'react'
import Head from 'next/head'
import { Accordion, Container, Navbar } from 'react-bootstrap'
import styles from '../../styles/Scavenger.module.css'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import rawData from '../../data/guide/campus.json'
import AccordionItem from 'react-bootstrap/AccordionItem'
import AccordionHeader from 'react-bootstrap/AccordionHeader'
import AccordionBody from 'react-bootstrap/AccordionBody'
import ReactMarkdown from 'react-markdown'

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
            Dein Campus
          </h2>

          Die THI hat zwei Hochschulgelände. Der Campus der Fakultät Nachhaltige Infrastruktur befindet sich in Neuburg.
          Der Stammcampus mit Mensa, Bibliothek und den restlichen Fakultäten befindet sich an der Esplanade in Ingolstadt.
          <hr/>

          <Accordion>
            {rawData.map((item) =>
              <AccordionItem eventKey={item.title} key={item.title}>
                <AccordionHeader>{item.title}</AccordionHeader>
                <AccordionBody>
                  <Accordion>
                    {item.content.map((content) =>
                      <AccordionItem eventKey={content.title} key={content.title}>
                        <AccordionHeader>{content.title}</AccordionHeader>
                        <AccordionBody>
                          <ReactMarkdown>{content.content}</ReactMarkdown>
                        </AccordionBody>
                      </AccordionItem>
                    )}
                  </Accordion>
                </AccordionBody>
              </AccordionItem>
            )}
          </Accordion>
          <hr/>

          <h2 className={styles.subtitle}>
            Weiterführende Seiten:
          </h2>

          <p>
            <Link href="/guide/glossary">
              <Button variant="primary">
                Glossar
              </Button>
            </Link>
          </p>

          <p>
            <Link href="/guide/studies">
              <Button variant="primary">
                Dein Studium
              </Button>
            </Link>
          </p>

          <p>
            <Link href="/guide/life">
              <Button variant="primary">
                Dein Studierendenleben
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
