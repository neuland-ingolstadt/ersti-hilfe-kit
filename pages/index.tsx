import React, { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Image from 'next/image'
import request, { gql } from 'graphql-request'
import { Button } from '@/components/ui/button'
import NavBar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'
import {
  BookText,
  Calendar,
  ExternalLink,
  Globe,
  Map,
  MapPin,
  Milestone,
  Smartphone,
} from 'lucide-react'
import { SiDiscord, SiInstagram } from 'react-icons/si'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  formatFriendlyDateTime,
  formatFriendlyDateTimeRange,
} from '@/lib/date-utils'
import clubs from '@/data/clubs.json'

interface CLEventsResponse {
  clEvents: CLEvent[]
}

export interface CLEvent {
  id: string
  organizer: string
  title: string
  begin: Date | null
  end: Date | null
  location: string | null
  description: string | null
  link: string | null
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
        title: 'Mehr in der Neuland.App',
        organizer: 'Neuland Ingolstadt e.V.',
        link: 'https://neuland.app',
      } as CLEvent,
    ]
      .map((event) => {
        const club = clubs.find((club) => club.club === event.organizer)

        if (club) {
          return { ...event, club }
        }

        return event
      })

      .map((event, index) => {
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-start gap-3">
              <div className="mt-0! flex flex-1 flex-col gap-1">
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.organizer}</CardDescription>
              </div>

              {'club' in event && (
                <div className="flex items-start gap-1">
                  <Link
                    href={event.club.website}
                    target="_blank"
                    passHref
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                    >
                      <Globe />
                    </Button>
                  </Link>

                  <Link
                    href={event.club.instagram}
                    target="_blank"
                    passHref
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                    >
                      <SiInstagram />
                    </Button>
                  </Link>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {event.begin != null && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={16} />
                  <span>
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
              {event.link != null && (
                <Link
                  href={event.link || '/'}
                  target="_blank"
                  passHref
                >
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

    // combine 3 cards into one carousel item
    return data.reduce((acc, _, index) => {
      if (index % 2 === 0) {
        acc.push(data.slice(index, index + 2))
      }
      return acc
    }, [] as JSX.Element[][])
  }, [events])

  return (
    <div>
      <Head>
        <title>Ersti-Hilfe-Kit</title>
      </Head>
      <div className="container flex flex-col gap-3">
        <NavBar />

        <main>
          <h1>Ersti-Hilfe-Kit</h1>

          <h2>Willkommen an der Technischen Hochschule Ingolstadt!</h2>

          <p>
            Um euch die Ankunft in Ingolstadt beziehungsweise Neuburg und den
            Studienbeginn etwas angenehmer zu gestalten, haben wir entschlossen,
            eine digitale O-Phase zu erproben. Wir hoffen, eure Zeit an unserer
            Hochschule damit etwas angenehmer gestalten zu können.
          </p>

          <p>&ndash; Eure Fachschaft Informatik &lt;3</p>

          {events.length > 0 && (
            <>
              <hr />

              <h2 className="flex items-center gap-2">
                <Calendar />
                <span>Veranstaltungen</span>
              </h2>

              <div className="mx-12">
                <Carousel>
                  <CarouselContent>
                    {cards.map((cards, idx) => (
                      <CarouselItem
                        key={idx}
                        className="grid grid-cols-2 gap-3"
                      >
                        {cards}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </>
          )}

          <hr id="studyguide" />

          <h2 className="flex items-center gap-2">
            <BookText />
            <span>Studienguide</span>
          </h2>

          <p>
            In den folgenden Themenbereichen versuchen wir das wichtigste
            Know-How zu eurem Studierendenleben an der THI zusammenzufassen.
          </p>

          <Link
            href="/guide/studies"
            passHref
          >
            <Button
              variant="secondary"
              className="my-3"
            >
              Zum Guide
            </Button>
          </Link>

          <p>
            Bei allen Informationen, die auf euch einprasseln, vergesst eines
            nicht: <b>Macht euch nicht verrückt!</b>
          </p>

          <hr id="cityguide" />

          <h2 className="flex items-center gap-2">
            <Milestone />
            <span> Virtuelle Stadt- und Campusführung</span>
          </h2>

          <p>
            Eine virtuelle Stadt- und Campusführung als interaktive Karte, damit
            ihr Ingolstadt und Neuburg selbst erkunden könnt.
          </p>

          <div className="mt-2 flex gap-3">
            <Link
              href="/tour/ingolstadt"
              target="_blank"
              passHref
            >
              <Button variant="secondary">
                <Map />
                Ingolstadt
              </Button>
            </Link>

            <Link
              href="/tour/neuburg"
              target="_blank"
              passHref
            >
              <Button variant="secondary">
                <Map />
                Neuburg
              </Button>
            </Link>
          </div>

          <hr id="app" />

          <h2 className="flex items-center gap-2">
            <Smartphone />
            <span>App</span>
          </h2>

          <p>
            Die neuland.app ist eine alternative App für die THI. Hier habt ihr
            euren Stundenplan, die Speisepläne sowie wichtige Termine und
            Veranstaltungen auf einen Blick.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Link href="https://apps.apple.com/app/apple-store/id1617096811?pt=124486931&ct=web&mt=8">
              <Image
                alt="Download im App Store"
                src="https://next.neuland.app/assets/Apple_Badge_DE.svg"
                width={150}
                height={50}
              />
            </Link>
            <Link href="https://play.google.com/store/apps/details?id=app.neuland">
              <Image
                alt="Get it on Google Play"
                src="https://next.neuland.app/assets/Google_Badge_DE.svg"
                width={165}
                height={50}
              />
            </Link>

            <Link
              href="https://neuland.app"
              target="_blank"
              rel="noreferrer"
              passHref
            >
              <Button className="text-md h-12 w-40 border border-gray-400 bg-black text-white hover:bg-gray-800">
                <Globe />
                <span>neuland.app</span>
              </Button>
            </Link>
          </div>

          <hr id="discord" />

          <h2 className="flex items-center gap-2">
            <SiDiscord size={24} />
            <span>Discord</span>
          </h2>

          <p>Hier könnt Ihr die Discord-Server der Fakultäten finden:</p>

          <div className="mt-2 flex flex-col">
            {SERVERS.map((server) => (
              <Link
                key={server.name}
                href={server.link}
                passHref
              >
                <Button
                  variant="link"
                  className="flex items-center gap-2"
                >
                  <ExternalLink />
                  <span>{server.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </main>

        <Footer />
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
          organizer
          title
          location
          begin
          end
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
      } else {
        const date = new Date(x.begin)
        return date > new Date()
      }
    })
    .slice(0, 5)

  return { props: { events } }
}
