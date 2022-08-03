import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCalendarAlt, faMapSigns } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'

import calendar from '../data/calendar.json'
import styles from '../styles/Home.module.css'
import { Accordion, ListGroup, ListGroupItem } from 'react-bootstrap'
import { formatFriendlyDateTime, formatFriendlyRelativeTime } from '../lib/date-utils'
import PropTypes from 'prop-types'

function Home ({ rawData }) {
  console.log(rawData)
  return (
    <Container className={styles.container}>
      <Head>
        <title>Digitale O-Phase</title>
        <meta name="description" content="Eine digitale O-Phase für die Erstis an der TH Ingolstadt."/>
        <link rel="icon" href="https://assets.neuland.app/StudVer_Logo_ohne%20Schrift.svg"/>
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
          Um euch die Ankunft in Ingolstadt beziehungsweise Neuburg und den Studienbeginn etwas angenehmer zu gestalten,
          haben wir entschlossen, eine digitale O-Phase zu erproben. Wir hoffen, eure Zeit an unserer Hochschule damit
          etwas angenehmer gestalten zu können.
        </p>

        <p>
          &ndash; Eure Fachschaft Informatik &lt;3
        </p>

        {calendar && calendar.length > 0 &&
          <>
            <hr/>

            <h2 className={styles.subtitle}>
              <FontAwesomeIcon icon={faCalendarAlt} fixedWidth/>
              <> Veranstaltungen</>
            </h2>

            <Accordion>
              {rawData.map((event, idx) => {
                const date = new Date(event.begin)
                return <ListGroup variant={'flush'} key={idx}>
                    <ListGroupItem>
                      <div className={styles.item}>
                        <div className={styles.left}>
                          {event.title}<br/>
                          am {formatFriendlyDateTime(date)}
                        </div>
                        <div className={styles.details}>
                          <p>{formatFriendlyRelativeTime(date)}</p>
                        </div>
                      </div>
                    </ListGroupItem>
                  </ListGroup>
              })}
            </Accordion>
          </>
        }

        <hr/>

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faBook} fixedWidth/>
          <> Studienguide</>
        </h2>

        <p>
          In den folgenden Themenbereichen versuchen wir das wichtigste Knowhow zu eurem Studierendenleben an der THI
          zusammenzufassen:
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
          <Link href="/guide/campus">
            <Button variant={'primary'}>
              Dein Campus
            </Button>
          </Link>
        </p>

        <p>
          <Link href="/guide/glossary">
            <Button variant={'primary'}>
              Glossar
            </Button>
          </Link>
        </p>

        <p>
          Bei allen Informationen, die auf euch einprasseln, vergesst eines nicht: <b>Macht euch nicht verrückt!</b>
          <br/><br/>
          Ein Neustart ist immer anstrengend und am besten lässt er sich ertragen, wenn man ihn mit anderen teilt. Nutzt
          die Erstsemesterangebote der Vereine und der Studierendenvertretung und ihr werdet schnell neue Leute
          kennenlernen. Bei Fragen und Nöten steht euch auch eure Studierendenvertretung im Raum W003 immer zur
          Verfügung!
        </p>

        <hr/>

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faMapSigns} fixedWidth/>
          <> Virtuelle Stadt- und Campusführung</>
        </h2>

        <p>
          Eine virtuelle Stadt- und Campusführung als interaktive Karte, damit ihr Ingolstadt und Neuburg selbst
          erkunden könnt.
        </p>

        <p>
          <Link href="/tour/ingolstadt">
            <Button variant="primary">
              Ingolstädter Führung öffnen
            </Button>
          </Link>
        </p>

        <p>
          <Link href="/tour/neuburg">
            <Button variant="primary">
              Neuburger Führung öffnen
            </Button>
          </Link>
        </p>

        <p>
          <Link href="/scavenger">
            <Button variant="primary">
              Digitale Schnitzeljagd (Ingolstadt)
            </Button>
          </Link>
        </p>

        <hr/>

        <h2 className={styles.subtitle}>
          <FontAwesomeIcon icon={faDiscord} fixedWidth/>
          <> Discord-Server der Fakultäten</>
        </h2>

        <p>
          Hier könnt Ihr die Discord-Server der Fakultäten finden:
        </p>

        <p>
          <a href="https://discord.gg/pTvQEZpga7" target="_blank" rel="noreferrer">
            <Button>
              Server der Fakultät I
            </Button>
          </a>
        </p>

        <p>
          <a href="https://discord.gg/2gzsCD744V" target="_blank" rel="noreferrer">
            <Button>
              Server der Fakultät E
            </Button>
          </a>
        </p>

        <p>
          <a href="https://discord.gg/gP4hQaxmRS" target="_blank" rel="noreferrer">
            <Button>
              Server der Fakultät M
            </Button>
          </a>
        </p>

        <p>
          <a href="https://discord.gg/geebhm5UKF" target="_blank" rel="noreferrer">
            <Button>
              Server der Fakultät WI
            </Button>
          </a>
        </p>

        <hr/>
      </main>

      <footer className={styles.footer}>
        <p>
          Ein Projekt der <a href="https://studverthi.de" target="_blank" rel="noreferrer">Fachschaft Informatik
          (StudVer)</a> in Kooperation mit <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland
          Ingolstadt e.V.</a>
        </p>
        <p>
          Wir würden uns über euer Feedback freuen &ndash; entweder über Discord oder <a
          href="mailto:info@neuland-ingolstadt.de">per E-Mail</a>.
        </p>
        <p>
          <a href="https://github.com/neuland-ingolstadt/orientierungsphase" target="_blank"
             rel="noreferrer">Quellcode</a>
          <> &ndash; </>
          <a href="https://neuland-ingolstadt.de/impressum.htm" target="_blank" rel="noreferrer">Impressum und
            Datenschutz</a>
        </p>
      </footer>
    </Container>
  )
}

export async function getServerSideProps () {
  const res = await fetch('https://neuland.app/api/cl-events')
  const dataWeb = await res.json()

  const rawData = calendar
    .concat(dataWeb)
    .sort((a, b) => a.end.localeCompare(b.end))
    .sort((a, b) => a.begin.localeCompare(b.begin))

  return { props: { rawData } }
}

Home.propTypes = {
  rawData: PropTypes.array
}

export default Home
