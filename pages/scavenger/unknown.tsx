import Head from 'next/head'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'

export default function Unknown() {
  return (
    <div className="container flex min-h-screen flex-col gap-3">
      <Head>
        <title>Unbekannter Ort</title>
      </Head>

      <NavBar />

      <main className="flex-1">
        <h1>Schnitzeljagd</h1>

        <p>
          Dieser Ort ist unbekannt. Scanne einen gültigen QR-Code auf dem
          Campus, um Punkte zu sammeln.
        </p>
      </main>

      <Footer />
    </div>
  )
}
