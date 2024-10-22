import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import levenshtein from 'js-levenshtein'
import ReactMarkdown from 'react-markdown'
import ScavengerDatabase from '@/lib/ScavengerDatabase'
import data from '@/lib/data'
import { GetServerSideProps } from 'next'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'
import { COMPONENTS } from '@/components/ui/markdownComponents'
import { MapPin, MessageCircleQuestion } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Confetti from 'react-confetti'
import { useWindowSize } from 'usehooks-ts'

interface ScavengerProps {
  id: string
  entry: Entry
}

export interface Entry {
  heading: string
  text: string
  points: number
  questions: Question[]
}

export interface Question {
  id: string
  points: number
  question: string
  answer: string[]
}

interface Quiz {
  id: string
  points: number
  question: string
  correctAnswers: string[]
  answer: string
  isCorrect: boolean
  isUnlocked: boolean
}

function checkAnswerSimilarity(givenAnswer: string, correctAnswers: string[]) {
  const applyLevenshtein = (x: string) =>
    levenshtein(x.toLowerCase(), givenAnswer.toLowerCase()) / x.length
  const test = Math.min(...correctAnswers.map(applyLevenshtein)) <= 0.2

  return test
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

export default function Scavenger({ id, entry }: ScavengerProps) {
  const [score, setScore] = useState()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showConfetti, setShowConfetti] = useState(true)
  const { width = 0, height = 0 } = useWindowSize()

  const handleShowConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1000)
  }, [])

  useEffect(() => {
    async function update() {
      if (!entry) {
        return
      }

      const db = new ScavengerDatabase()
      await db.addItem(id, entry.points)
      setScore(await db.getScore())

      const newQuizzes: Promise<Quiz[]> = Promise.all(
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

  async function changeQuizAnswer(
    quiz: Quiz | undefined,
    newAnswer: string | undefined
  ) {
    if (!quiz || !newAnswer) {
      return false
    }

    quiz.answer = newAnswer
    quiz.isCorrect = checkAnswerSimilarity(newAnswer, quiz.correctAnswers)

    if (quiz.isCorrect && !quiz.isUnlocked) {
      const db = new ScavengerDatabase()
      await db.addItemQuestion(`${id}-${quiz.id}`, quiz, quiz.points)
      setScore(await db.getScore())

      quiz.isUnlocked = true
    }

    setQuizzes((prev) => [...prev.filter((q) => q.id !== quiz.id), quiz])

    return quiz.isCorrect
  }

  const schema = z.object(
    Object.fromEntries(
      entry.questions.map((question) => [
        question.id,
        z
          .string()
          .optional()
          .refine(
            (x) =>
              changeQuizAnswer(
                quizzes.find((q) => q.id === question.id),
                x
              ),
            'Das ist nicht die richtige Antwort.'
          )
          .optional(),
      ])
    )
  )

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: Object.fromEntries(
      quizzes.map((quiz) => [quiz.id, quiz.isCorrect ? quiz.answer : ''])
    ),
  })

  const onSubmit = useCallback(() => {
    console.log('submit')

    // check if all answers are correct
    const allCorrect = quizzes.every((quiz) => quiz.isCorrect)

    if (allCorrect) {
      console.log('all correct')
    }

    handleShowConfetti()
  }, [handleShowConfetti])

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

      <Confetti
        width={width}
        height={height}
        numberOfPieces={showConfetti ? 200 : 0}
      />

      <main className="flex-1">
        <h1 className="flex items-center gap-1">
          <MapPin size={32} /> {entry.heading}
        </h1>
        <ReactMarkdown components={COMPONENTS}>{entry.text}</ReactMarkdown>
        {quizzes.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-1">
                <MessageCircleQuestion size={32} /> Fragen
              </CardTitle>
              <CardDescription>
                Für die richtige Antwort gibt es extra Punkte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {quizzes.map((quiz) => (
                    <FormField
                      control={form.control}
                      name={quiz.id}
                      key={quiz.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{quiz.question}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <Button>Prüfen</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
