import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Form } from 'react-bootstrap'
import { faMapMarkerAlt, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import levenshtein from 'js-levenshtein'
import ReactMarkdown from 'react-markdown'
import ScavengerDatabase from '@/lib/ScavengerDatabase'
import data from '@/lib/data'
import { GetServerSideProps } from 'next'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'

interface ScavengerProps {
  id: string
  entry: any
}

function checkAnswerSimilarity(givenAnswer, correctAnswers) {
  const applyLevenshtein = (x) =>
    levenshtein(x.toLowerCase(), givenAnswer.toLowerCase()) / x.length
  return Math.min(...correctAnswers.map(applyLevenshtein)) <= 0.2
}

export const getServerSideProps: GetServerSideProps<ScavengerProps> = async ({
  query,
}) => {
  const { id } = query

  if (typeof id !== 'string') {
    return {
      redirect: {
        destination: '/scavenger/unknown',
        permanent: false,
      },
    }
  }

  const entry = data[id]
  if (!entry) {
    return {
      redirect: {
        destination: '/scavenger/unknown',
        permanent: false,
      },
    }
  }

  return {
    props: {
      id,
      entry,
    },
  }
}

const styles = {}

export default function Scavenger({ id, entry }: ScavengerProps) {
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
    <div className="container flex min-h-screen flex-col gap-3">
      <Head>
        <title>{entry ? entry.heading : 'Ungültiger Ort'}</title>
        <meta
          name="description"
          content="Eine digitale Schnitzeljagd für die Erstis an der TH Ingolstadt."
        />
      </Head>

      <NavBar />

      <main className="flex-1">
        {entry && (
          <>
            <h1>
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
                  <small>Für die richtige Antwort gibt es extra Punkte.</small>
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
      </main>

      <Footer />
    </div>
  )
}
