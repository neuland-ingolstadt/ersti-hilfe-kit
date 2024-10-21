import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Form, Navbar } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { faMapMarkerAlt, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import levenshtein from 'js-levenshtein'
import ReactMarkdown from 'react-markdown'
import styles from '../../styles/Scavenger.module.css'
import ScavengerDatabase from '../../lib/ScavengerDatabase'
import data from '../../lib/data'
import Image from 'next/image'

function checkAnswerSimilarity(givenAnswer, correctAnswers) {
  const applyLevenshtein = (x) =>
    levenshtein(x.toLowerCase(), givenAnswer.toLowerCase()) / x.length
  return Math.min(...correctAnswers.map(applyLevenshtein)) <= 0.2
}

export async function getServerSideProps(context) {
  const { id } = context.query
  return {
    props: {
      id,
      entry: data[id] || null,
      error: data[id] ? null : 'Dieser Ort existiert nicht.',
    },
  }
}

export default function Scavenger({ id, entry, error }) {
  const [score, setScore] = useState()
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    async function update() {
      if (!entry) {
        return
      }

      const db = new ScavengerDatabase()
      await db.addItem(id, entry.points)
      setScore(await db.getScore())

      const newQuizzes = Promise.all(
        entry.questions.map(async (question) => {
          const oldAnswer = await db.getItemQuestion(`${id}-${question.id}`)

          return {
            id: question.id,
            points: question.points,
            question: question.question,
            correctAnswers: question.answer,
            answer: oldAnswer?.question.answer || '',
            isCorrect: !!oldAnswer,
            isUnlocked: !!oldAnswer,
          }
        })
      )
      setQuizzes(await newQuizzes)
    }
    update()
  }, [entry, id])

  async function changeQuizAnswer(index, newAnswer) {
    const dup = [...quizzes]
    const quiz = { ...dup[index] }

    quiz.answer = newAnswer
    quiz.isCorrect = checkAnswerSimilarity(newAnswer, quiz.correctAnswers)

    if (quiz.isCorrect && !quiz.isUnlocked) {
      const db = new ScavengerDatabase()
      await db.addItemQuestion(`${id}-${quiz.id}`, quiz, quiz.points)
      setScore(await db.getScore())

      quiz.isUnlocked = true
    }

    dup[index] = quiz
    setQuizzes(dup)
  }

  return (
    <>
      <Head>
        <title>{entry ? entry.heading : 'Ungültiger Ort'}</title>
        <meta
          name="description"
          content="Eine digitale Schnitzeljagd für die Erstis an der TH Ingolstadt."
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
          {entry && (
            <>
              <h1 className={styles.title}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {entry.heading}
              </h1>
              <p>
                <ReactMarkdown>{entry.text}</ReactMarkdown>
              </p>
              {quizzes.length > 0 && (
                <>
                  <h2 className={styles.subtitle}>
                    <FontAwesomeIcon icon={faQuestion} /> Fragen
                  </h2>
                  <p className="text-muted">
                    <small>
                      Für die richtige Antwort gibt es extra Punkte.
                    </small>
                  </p>
                  {quizzes.map((quiz, i) => (
                    <div
                      key={i}
                      className={styles.question}
                    >
                      <p>
                        <strong>{quiz.question}</strong>
                      </p>
                      <Form>
                        <Form.Control
                          type="text"
                          placeholder="Antwort..."
                          value={quiz.answer || ''}
                          isValid={
                            quiz.isCorrect ||
                            (quiz.answer.length === 0 && quiz.isUnlocked)
                          }
                          isInvalid={quiz.answer.length > 0 && !quiz.isCorrect}
                          onChange={(e) => changeQuizAnswer(i, e.target.value)}
                        />
                      </Form>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          {error && <>{error}</>}
        </main>

        <hr />

        <footer className={styles.footer}>
          <p>
            Finde drei QR-Codes und komm dann zum Stand von Neuland Ingolstadt,
            um deinen Preis abzuholen!
          </p>
          <p>
            <small>
              <>Fragen? </>
              <Link href="/scavenger">
                <a>Hier gibt Informationen zur Schnitzeljagd.</a>
              </Link>
            </small>
          </p>
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
Scavenger.propTypes = {
  id: PropTypes.string,
  entry: PropTypes.any,
  error: PropTypes.string,
}
