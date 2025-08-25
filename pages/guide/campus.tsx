import Head from 'next/head'
import GuideAccordion from '@/components/guide/guideAccordion'
import GuideTabs from '@/components/guide/guideTabs'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'
import guide from '@/data/guide/campus.json'

export default function Campus() {
  return (
    <div className="container flex min-h-screen flex-col gap-3">
      <Head>
        <title>Studienguide</title>
      </Head>

      <NavBar />

      <main className="flex-1">
        <GuideTabs />

        <h2>Dein Campus</h2>

        <p>
          Die THI hat zwei Hochschulgelände. Der Campus der Fakultät Nachhaltige
          Infrastruktur befindet sich in Neuburg. Der Stammcampus mit Mensa,
          Bibliothek und den restlichen Fakultäten befindet sich an der
          Esplanade in Ingolstadt.
        </p>

        <GuideAccordion guide={guide} />
      </main>

      <Footer />
    </div>
  )
}
