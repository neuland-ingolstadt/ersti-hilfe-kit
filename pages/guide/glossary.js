import React, { useState } from 'react'
import Head from 'next/head'
import { Accordion, Container, Navbar, Offcanvas } from 'react-bootstrap'
import styles from '../../styles/Scavenger.module.css'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import rawData from '../../data/guide/glossary.json'
import AccordionItem from 'react-bootstrap/AccordionItem'
import AccordionHeader from 'react-bootstrap/AccordionHeader'
import AccordionBody from 'react-bootstrap/AccordionBody'
import ReactMarkdown from 'react-markdown'
import Hamburger from 'hamburger-react'
import Image from 'next/image'

export default function Studies() {
  const data = rawData.sort((a, b) => a.title.localeCompare(b.title))
  const [isOpen, setOpen] = useState(false)
  const handleToggle = () => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <Head>
        <title>Studienguide</title>
        <meta
          name="description"
          content="Ein digitales Guide für die Erstis an der TH Ingolstadt."
        />
        <link
          rel="icon"
          href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
        />
      </Head>

      <Navbar
        bg="light"
        variant="light"
      >
        <Container>
          <Navbar.Brand href="/">
            <Image
              src="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"
              alt="Studierendenvertretung TH Ingolstadt"
              className={`d-inline-block align-top ${styles.logo}`}
              height={30}
              width={30}
            />{' '}
            Studienguide
          </Navbar.Brand>
          <Hamburger
            toggled={isOpen}
            onToggle={setOpen}
          />
        </Container>
        <Offcanvas
          show={isOpen}
          onHide={handleToggle}
          placement={'end'}
        >
          <Offcanvas.Body className={styles.navbar}>
            <>
              <li>
                <Link href="../guide/studies">
                  <h3>Dein Studium</h3>
                </Link>
              </li>
              <li>
                <Link href="../guide/life">
                  <h3>Dein Studierendenleben</h3>
                </Link>
              </li>
              <li>
                <Link href="../guide/campus">
                  <h3>Dein Campus</h3>
                </Link>
              </li>
              <li>
                <Link href="../guide/glossary">
                  <h3 className={styles.active}>Glossar</h3>
                </Link>
              </li>
              <li>
                <Link href="../">
                  <h3>Zurück</h3>
                </Link>
              </li>
              <li>
                <Hamburger
                  toggled={isOpen}
                  onToggle={setOpen}
                />
              </li>
            </>
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>

      <Container className={styles.container}>
        <main className={styles.main}>
          <h2 className={styles.title}>Glossar</h2>

          <p>
            Damit du dich in der “Hochschulsprache“ gut zurechtfindest, haben
            wir ein Glossar angelegt, in dem wir dir Abkürzungen, Begriffe und
            Formulierungen kurz und knapp erläutern.
          </p>

          <Accordion>
            {data.map((item) => (
              <AccordionItem
                eventKey={item.title}
                key={item.title}
              >
                <AccordionHeader>{item.title}</AccordionHeader>
                <AccordionBody>
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </AccordionBody>
              </AccordionItem>
            ))}
          </Accordion>
          <hr />

          <h2 className={styles.subtitle}>Navigation</h2>

          <p>
            <Link href="/guide/studies">
              <Button variant="outline-primary">Studium</Button>
            </Link>
          </p>

          <p>
            <Link href="/guide/life">
              <Button variant="outline-primary">Studierendenleben</Button>
            </Link>
          </p>

          <p>
            <Link href="/guide/campus">
              <Button variant="outline-primary">Campus</Button>
            </Link>
          </p>

          <p>
            <Link href="../">
              <Button variant="outline-secondary">Zurück</Button>
            </Link>
          </p>
        </main>

        <footer className={styles.footer}>
          <p>
            <small>
              Erstellt und entwickelt von der{' '}
              <a
                href="https://studverthi.de"
                target="_blank"
                rel="noreferrer"
              >
                Studierendenvertretung
              </a>{' '}
              und{' '}
              <a
                href="https://neuland-ingolstadt.de"
                target="_blank"
                rel="noreferrer"
              >
                Neuland Ingolstadt.
              </a>
            </small>
          </p>
        </footer>
      </Container>
    </>
  )
}
