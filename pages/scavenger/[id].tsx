import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Footer from '@/components/ui/footer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { COMPONENTS } from '@/components/ui/markdownComponents'
import NavBar from '@/components/ui/navbar'
import ScavengerDatabase from '@/lib/ScavengerDatabase'
import data from '@/lib/data'
import { zodResolver } from '@hookform/resolvers/zod'
import levenshtein from 'js-levenshtein'
import { MapPin, MessageCircleQuestion, Trophy } from 'lucide-react'
import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import { useWindowSize } from 'usehooks-ts'
import z from 'zod'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

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
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  const handleShowConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
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

  const changeQuizAnswer = useCallback(
    async (quiz: Quiz | undefined, newAnswer: string | undefined) => {
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

      setQuizzes((prev) => {
        const index = prev.findIndex((q) => q.id === quiz.id)
        prev[index] = quiz

        return [...prev]
      })

      return quiz.isCorrect
    },
    [id]
  )

  const schema = useMemo(
    () =>
      z.object(
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
      ),
    [entry.questions, quizzes, changeQuizAnswer]
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
    if (
      form.formState.isValid &&
      Object.values(form.getValues()).some(Boolean)
    ) {
      handleShowConfetti()
      return
    }

    console.log('error')

    // check if every question is empty and show error message
    const emptyQuestions = Object.values(form.getValues())
      .map((value) => !value)
      .every(Boolean)
    console.log(emptyQuestions)

    if (emptyQuestions) {
      // get all fields and set them to error
      const fields = Object.keys(form.getValues())
      for (const field of fields) {
        form.setError(field, {
          type: 'manual',
          message: 'Bitte gib eine Antwort ein.',
        })
      }
    }
  }, [form, handleShowConfetti])

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
        numberOfPieces={showConfetti ? 250 : 0}
      />

      <main className="flex-1">
        <h1 className="flex items-center gap-3">
          <MapPin size={32} /> {entry.heading}
        </h1>
        <ReactMarkdown components={COMPONENTS}>{entry.text}</ReactMarkdown>
        {quizzes.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircleQuestion size={24} /> Fragen
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Trophy size={24} />
              Dein Punktestand
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              Dein aktueller Punktestand beträgt:{' '}
              <strong>{score} Punkte.</strong>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
