import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Navbar, Form, InputGroup, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { faMapMarkerAlt, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import levenshtein from 'js-levenshtein'
import styles from '../../styles/Scavenger.module.css'
import ScavengerDatabase from '../../lib/ScavengerDatabase'
import data from '../../lib/data'

function checkAnswerSimilarity (givenAnswer, correctAnswers) {
  return Math.min(...correctAnswers.map(correctAnswer => levenshtein(correctAnswer.toLowerCase(), givenAnswer.toLowerCase()) / correctAnswer.length)) <= 0.25
}

export async function getServerSideProps (context) {
  const { id } = context.query
  return {
    props: {
      id,
      entry: data[id] || null,
      error: data[id] ? null : 'Dieser Ort existiert nicht.'
    }
  }
}

export default function Scavenger ({ id, entry, error }) {
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [score, setScore] = useState()
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    async function update () {
      if (!entry) {
        return
      }

      const db = new ScavengerDatabase()
      await db.addItem(id, 100)
      setScore(await db.getScore())
    }
    update()
  }, [id, lastUpdated])

  const check = useCallback(async (question, givenAnswer) => {
    const correctAnswers = entry.questions.find(x => x.question === question).answer
    if (checkAnswerSimilarity(givenAnswer, correctAnswers)) {
      const db = new ScavengerDatabase()
      await db.addItemQuestion(id, question, 100)
      setLastUpdated(Date.now())
    } else {
      alert('Das war leider nicht die richtige Antwort.')
    }
  }, [answers])

  // the page contents are in a separate component
  // because Leaflet can't handle SSR
  return (
    <>
      <Head>
        <title>{entry ? entry.heading : 'Ungültiger Ort'}</title>
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
            <> {score} </>
          </Navbar.Text>
        </Container>
      </Navbar>

      <Container className={styles.container}>
        <main className={styles.main}>
          {entry &&
            <>
              <h1 className={styles.title}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {entry.heading}
              </h1>
              <p>
                {entry.text}
              </p>
              <h2 className={styles.subtitle}>
                <FontAwesomeIcon icon={faQuestion} /> Fragen
              </h2>
              <p className="text-muted">
                <small>
                  Für die richtige Antwort gibt es extra Punkte.
                </small>
              </p>
              {entry.questions.map(question =>
                <div key={question.question} className={styles.question}>
                  <p key={question.question}>
                    <strong>{question.question}</strong>
                  </p>
                  <Form>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Antwort"
                        value={answers[question.question] || ''}
                        onChange={e => setAnswers({ ...answers, [question.question]: e.target.value })}
                      />
                      <Button onClick={() => check(question.question, answers[question.question])}>OK</Button>
                    </InputGroup>
                  </Form>
                </div>
              )}
            </>
          }
          {error &&
            <>
              {error}
            </>
          }
        </main>

        <hr />

        <footer className={styles.footer}>
          <p>
            <small>
              <>Fragen? </>
              <Link href="/scavenger">
                <a>
                  Hier gibt Informationen zur Schnitzeljagd.
                </a>
              </Link>
            </small>
          </p>
          <p>
            <small>
              Erstellt und entwickelt von der <a href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung" target="_blank" rel="noreferrer">Studierendenvertretung</a> und <a href="https://neuland-ingolstadt.de" target="_blank" rel="noreferrer">Neuland Ingolstadt.</a>
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
