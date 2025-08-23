import Head from 'next/head'
import { useEffect, useState } from 'react'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'
import ScavengerDatabase from '@/lib/ScavengerDatabase'

export default function Scavenger() {
  const [score, setScore] = useState()

  useEffect(() => {
    async function update() {
      const db = new ScavengerDatabase()
      setScore(await db.getScore())
    }
    update()
  }, [])

  return (
    <div className="container flex min-h-screen flex-col gap-3">
      <Head>
        <title>Schnitzeljagd</title>
        <meta
          name="description"
          content="Eine digitale Schnitzeljagd für die Erstis an der TH Ingolstadt."
        />
      </Head>

      <NavBar />

      <main className="flex-1">
        <h1>Was ist das?</h1>
        <p>
          Das ist eine Campusführung in Form einer digitalen Schnitzeljagd,
          welche euch dabei helfen soll, eure neue Hochschule besser
          kennenzulernen.
        </p>

        <h3 className="mt-6">Wie mache ich mit?</h3>
        <p>
          Überall in der THI sind an interessanten Orten QR-Codes angebracht.
          Scanne diesen QR-Code, um Punkte gutgeschrieben zu bekommen. Die
          Personen, die am Ende die meisten Punkte haben, kriegen als Preis
          etwas THI Merch. Alle anderen haben zumindest etwas über ihre
          Hochschule gelernt. ;)
        </p>
        <p className="mt-3">
          Du hast aktuell <strong>{score || 0} Punkte</strong>.
        </p>
      </main>

      <Footer />
    </div>
  )
}
