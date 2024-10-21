import React from 'react'
import Head from 'next/head'
import guide from '@/data/guide/studies.json'
import NavBar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'
import GuideTabs from '@/components/guide/guideTabs'
import GuideAccordion from '@/components/guide/guideAccordion'

export default function StudiesGuide() {
  return (
    <div className="container flex min-h-screen flex-col gap-3">
      <Head>
        <title>Studienguide</title>
      </Head>

      <NavBar />

      <main className="flex-1">
        <GuideTabs />

        <h2>Dein Studium</h2>

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

        <GuideAccordion guide={guide} />
      </main>

      <Footer />
    </div>
  )
}
