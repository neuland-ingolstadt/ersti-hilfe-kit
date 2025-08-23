import Head from 'next/head'
import GuideAccordion from '@/components/guide/guideAccordion'
import GuideTabs from '@/components/guide/guideTabs'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'
import guide from '@/data/guide/life.json'

export default function LifeGuide() {
  return (
    <div className="container flex min-h-screen flex-col gap-3">
      <Head>
        <title>Studienguide</title>
        <meta
          name="description"
          content="Ein digitaler Guide für die Erstis an der TH Ingolstadt."
        />
      </Head>

      <NavBar />

      <main className="flex-1">
        <GuideTabs />

        <h2>Dein Studierendenleben</h2>

        <p>
          Studium ist mehr als Bücher wälzen, Vorlesungen besuchen und Leistung
          zeigen. Der Campus, die Stadt Ingolstadt und zahlreiche Einrichtungen
          bieten eine Vielzahl von Möglichkeiten, neben dem Lernen das Leben
          nicht zu kurz kommen zu lassen. Ob Konzert, Kickern oder Kirche – auf
          dieser Seiten ist sicher was für dich dabei.
        </p>

        <GuideAccordion guide={guide} />
      </main>

      <Footer />
    </div>
  )
}
