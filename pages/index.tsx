import Head from 'next/head'
import Link from 'next/link'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Footer from '@/components/ui/footer'
import NavBar from '@/components/ui/navbar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  formatFriendlyDateTime,
  formatFriendlyDateTimeRange,
} from '@/lib/date-utils'
import request, { gql } from 'graphql-request'
import {
  BookText,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Milestone,
  Smartphone,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { SiDiscord, SiInstagram } from 'react-icons/si'
import ReactMap from 'react-map-gl/maplibre'

const CENTER = [48.76415, 11.42434]

interface CLEventsResponse {
  clEvents: CLEvent[]
}

interface Host {
  name: string
  website: string | null
  instagram: string | null
}

interface MultiLang {
  de: string
  en: string
}

export interface CLEvent {
  id: string
  title: MultiLang
  host: Host
  begin: Date | null
  end: Date | null
  location: string | null
  eventUrl: string | null
}

interface HomeProps {
  events: CLEvent[]
}

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_NEULAND_GRAPHQL_ENDPOINT ||
  'https://api.neuland.app/graphql'

const SERVERS = [
  {
    name: 'Fakultät Informatik',
    link: 'https://discord.gg/pTvQEZpga7',
  },
  {
    name: 'Fakultät Elektro- und Informationstechnik',
    link: 'https://discord.gg/2gzsCD744V',
  },
  {
    name: 'Fakultät Maschinenbau',
    link: 'https://discord.gg/gP4hQaxmRS',
  },
  {
    name: 'Fakultät Wirtschaftsingenieurwesen',
    link: 'https://discord.gg/geebhm5UKF',
  },
]

export default function Home({ events }: HomeProps) {
  const cards = useMemo(() => {
    const data = [
      ...events,
      {
        title: {
          de: 'Mehr in der Neuland.App',
          en: 'More on Neuland.App',
        },
        host: {
          name: 'Neuland Ingolstadt e.V.',
        },
        eventUrl: 'https://neuland.app',
      } as CLEvent,
    ].map((event) => {
      return (
        <Card
          key={event.id}
          className="bg border-0 bg-slate-200 dark:bg-white dark:bg-opacity-5"
        >
          <CardHeader className="flex flex-row items-start gap-0">
            <div className="mt-0 flex flex-1 flex-col">
              <span className="truncate text-lg font-bold">
                {event.title.de}
              </span>
              <span className="text-muted-foreground">{event.host.name}</span>
            </div>

            <div className="flex flex-shrink-0 items-start gap-1">
              {event.host.website != null && (
                <Link href={event.host.website} target="_blank" passHref>
                  <Button variant="secondary" size="icon">
                    <Globe />
                  </Button>
                </Link>
              )}

              {event.host.instagram != null && (
                <Link href={event.host.instagram} target="_blank" passHref>
                  <Button variant="secondary" size="icon">
                    <SiInstagram />
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {event.begin != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar size={16} />
                <span className="truncate">
                  {event.end != null
                    ? formatFriendlyDateTimeRange(event.begin, event.end)
                    : formatFriendlyDateTime(event.begin)}
                </span>
              </span>
            )}

            {event.location != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin size={16} />
                <span>{event.location}</span>
              </span>
            )}

            {event.eventUrl != null && (
              <Link href={event.eventUrl || '/'} target="_blank" passHref>
                <Button variant="secondary">
                  <ExternalLink />
                  <span>Mehr erfahren</span>
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )
    })

    return data
  }, [events])

  const { resolvedTheme } = useTheme()

  return (
    <div>
      <Head>
        <title>Ersti-Hilfe-Kit</title>
      </Head>
      <div className="flex flex-col gap-3">
        <NavBar overlay />

        <main>
          <div className="-z-10 flex min-h-screen w-screen grid-cols-6 grid-rows-6 flex-col gap-4 p-4 pt-20 lg:grid lg:p-8 lg:pt-24 xl:max-h-screen">
            <Card className="col-span-4 row-span-3 flex flex-col gap-6 bg-secondary p-6 lg:p-12">
              <h1 className="text-4xl font-bold md:text-5xl">
                <span>Willkommen an der </span>
                <br />
                <span className="bg-gradient-to-r from-blue-800 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
                  Technischen Hochschule Ingolstadt!
                </span>
              </h1>
              <h2 className="max-w-4xl text-lg">
                Um euch die Ankunft in Ingolstadt beziehungsweise Neuburg und
                den Studienbeginn etwas angenehmer zu gestalten, haben wir
                entschlossen, eine digitale O-Phase zu erproben. Wir hoffen,
                eure Zeit an unserer Hochschule damit etwas angenehmer gestalten
                zu können.
              </h2>

              <span>&ndash; Eure Fachschaft Informatik &lt;3</span>
            </Card>

            <Card className="cursor-pointer! relative row-span-4 h-[30vh] rounded-xl lg:col-span-2 lg:h-full">
              <Link href="/tour/ingolstadt" passHref>
                <div className="absolute z-10 h-full w-full rounded-xl p-4">
                  <h3 className="flex w-fit items-center gap-2 rounded-lg bg-secondary px-3 py-1 text-2xl font-bold">
                    <Milestone size={24} />
                    <span>Virtuelle Stadt- und Campusführung</span>
                  </h3>
                </div>
              </Link>

              <ReactMap
                reuseMaps
                mapStyle={`https://tile.neuland.app/styles/${resolvedTheme}/style.json`}
                initialViewState={{
                  latitude: CENTER[0],
                  longitude: CENTER[1],
                  zoom: 13,
                }}
                dragPan={false}
                dragRotate={false}
                scrollZoom={false}
                touchPitch={false}
                touchZoomRotate={false}
                doubleClickZoom={false}
                keyboard={false}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '1em',
                }}
                attributionControl={false}
              />
            </Card>

            <Card className="col-span-2 row-span-3 flex flex-col gap-3 bg-secondary p-6">
              <h3 className="flex items-center gap-2 text-2xl font-bold">
                <BookText size={24} />
                <span>Guide</span>
              </h3>

              <p className="text-muted-foreground">
                In den folgenden Themenbereichen versuchen wir das wichtigste
                Know-How zu eurem Studierendenleben an der THI zusammenzufassen.
              </p>

              <p className="flex-1 text-muted-foreground">
                Bei allen Informationen, die auf euch einprasseln, vergesst
                eines nicht: <b>Macht euch nicht verrückt!</b>
              </p>

              <Link href="/guide/studies" passHref>
                <Button variant="outline" className="w-full">
                  Zum Guide
                </Button>
              </Link>
            </Card>

            <Card className="col-span-2 row-span-3 bg-secondary p-6 xl:max-h-full">
              <h3 className="flex items-center gap-2 text-2xl font-bold">
                <Calendar size={24} />
                <span>Events</span>
              </h3>

              <ScrollArea className="h-[calc(100%-48px)] overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {cards.map((card) => (
                    <div key={card.key} className="grid grid-cols-1 gap-3">
                      {card}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <Card className="col-span-2 row-span-2 flex flex-col gap-3 bg-secondary p-6">
              <h3 className="flex items-center gap-2 text-2xl font-bold">
                <Smartphone size={24} />
                <span>Apps</span>
              </h3>

              <p className="flex-1 text-muted-foreground">
                Die{' '}
                <Link
                  href="https://next.neuland.app"
                  target="_blank"
                  className="text-primary"
                >
                  Neuland Next App
                </Link>{' '}
                ist eine alternative App für die THI. Hier habt ihr euren
                Stundenplan, die Speisepläne sowie wichtige Termine und
                Veranstaltungen auf einen Blick.
              </p>

              <div className="flex flex-col gap-3 xl:flex-row">
                <Link
                  href="https://apps.apple.com/app/apple-store/id1617096811?pt=124486931&ct=web&mt=8"
                  target="_blank"
                  rel="noreferrer"
                  passHref
                >
                  <Image
                    alt="Download im App Store"
                    src="https://next.neuland.app/assets/Apple_Badge_DE.svg"
                    width={150}
                    height={50}
                  />
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=app.neuland"
                  target="_blank"
                  passHref
                >
                  <Image
                    alt="Get it on Google Play"
                    src="https://next.neuland.app/assets/Google_Badge_DE.svg"
                    width={165}
                    height={50}
                  />
                </Link>
              </div>
            </Card>
          </div>

          <div className="container my-6">
            <h4 className="flex items-center gap-2 text-2xl font-bold">
              <SiDiscord size={24} />
              <span>Discord</span>
            </h4>

            <p>Hier könnt Ihr die Discord-Server der Fakultäten finden:</p>

            <div className="mt-2 flex flex-col">
              {SERVERS.map((server) => (
                <Link key={server.name} href={server.link} passHref>
                  <Button variant="link" className="flex items-center gap-2">
                    <ExternalLink />
                    <span>{server.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer className="container" />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await request<CLEventsResponse>(
    GRAPHQL_ENDPOINT,
    gql`
      query {
        clEvents {
          id
          host {
            name
            website
            instagram
          }
          title {
            de
            en
          }
          begin
          end
          location
          eventUrl
          isMoodleEvent
        }
      }
    `.replace(/\s+/g, ' ')
  )

  const eventsData = data.clEvents.map((event) => {
    return {
      ...event,
      begin: new Date(Number(event.begin)).toISOString(),
      end: event.end != null ? new Date(Number(event.end)).toISOString() : null,
    }
  })

  const events = eventsData
    .sort((a, b) => a.begin.localeCompare(b.begin))
    .filter((x) => {
      if (x.end != null) {
        const date = new Date(x.end)
        return date > new Date()
      }
      const date = new Date(x.begin)
      return date > new Date()
    })
    .slice(0, 3)

  return { props: { events } }
}
