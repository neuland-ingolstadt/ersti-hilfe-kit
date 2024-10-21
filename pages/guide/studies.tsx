import React, { useState } from 'react'
import Head from 'next/head'
import { Accordion, Container } from 'react-bootstrap'
const styles = {}
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import rawData from '../../data/guide/studies.json'
import AccordionItem from 'react-bootstrap/AccordionItem'
import AccordionHeader from 'react-bootstrap/AccordionHeader'
import AccordionBody from 'react-bootstrap/AccordionBody'
import ReactMarkdown from 'react-markdown'
import Hamburger from 'hamburger-react'
import Image from 'next/image'
import NavBar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

export default function Studies() {
  const [isOpen, setOpen] = useState(false)
  const handleToggle = () => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Studienguide</title>
      </Head>

      <NavBar />

      <main className={styles.main}>
        <h2 className={styles.title}>Dein Studium</h2>

        <p>
          Der klare Unterschied zwischen Schule und Studium ist, dass man sich
          selbst darum kümmern muss, alle wichtigen Informationen zu erhalten.
          Dennoch können Fragen aufkommen, dafür findet ihr auf dieser Seite die
          meisten Informationen unter anderem wo ihr nachfragen könnt.
        </p>

        <p>
          <b>Wichtig:</b> Termine und Noten werden meist nur noch auf
          elektronischem Wege bekannt gegeben.
        </p>

        <Accordion>
          {rawData.map((item) => (
            <AccordionItem
              eventKey={item.title}
              key={item.title}
            >
              <AccordionHeader>{item.title}</AccordionHeader>
              <AccordionBody>
                <Accordion>
                  {item.content.map((content) => (
                    <AccordionItem
                      eventKey={content.title}
                      key={content.title}
                    >
                      <AccordionHeader>{content.title}</AccordionHeader>
                      <AccordionBody>
                        <ReactMarkdown>{content.content}</ReactMarkdown>
                        {content.link.length > 0 && (
                          <Link href={content.link}>
                            <Button variant="outline-info">
                              {content.linktitle}
                            </Button>
                          </Link>
                        )}
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
        <hr />

        <h2 className={styles.subtitle}>Navigation</h2>

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
          <Link href="/guide/glossary">
            <Button variant="outline-primary">Glossar</Button>
          </Link>
        </p>

        <p>
          <Link href="../">
            <Button variant="outline-secondary">Zurück</Button>
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  )
}
