import Image from 'next/image'
import Link from 'next/link'
import { createRef, useCallback, useEffect, useMemo, useState } from 'react'

import { AttributionControl } from '@/components/map/attributionControl'
import MapStyleControl from '@/components/map/styleControl'
import TourDetails from '@/components/tour/tourDetails'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { City, TourData } from '@/pages/tour/[city]'
import { ChevronsLeft, ImagePlay, MapPin, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import ReactMap, { type MapRef, Marker } from 'react-map-gl/maplibre'
import { useMediaQuery } from 'usehooks-ts'

interface CategoryProps {
  fill: string
  stroke: string
}

const COLORS: Record<string, CategoryProps> = {
  gastro: {
    fill: '#2ECC71',
    stroke: '#367a4b',
  },
  hochschule: {
    fill: '#3498DB',
    stroke: '#2c6189',
  },
  chill: {
    fill: '#F39C12',
    stroke: '#9f6b26',
  },
  sehenswuerdig: {
    fill: '#E74C3C',
    stroke: '#8f392c',
  },
  nuetzlich: {
    fill: '#BDC3C7',
    stroke: '#74787a',
  },
}

const HEADINGS: Record<string, string> = {
  gastro: 'Bars & Cafés',
  hochschule: 'Hochschule',
  chill: 'Chillen',
  sehenswuerdig: 'Sehenswürdigkeiten',
  nuetzlich: 'Nützliches',
}

interface TourMapProps {
  center: [number, number]
  data: TourData[]
}

export type MapStyle = 'bright' | 'light' | 'dark'

export default function TourMap({ center, data }: TourMapProps) {
  const router = useRouter()

  const city = useMemo(() => {
    return router.query.city as string
  }, [router.query.city])

  const { resolvedTheme } = useTheme()
  const [mapStyle, setMapStyle] = useState<MapStyle>(
    resolvedTheme === 'dark' ? 'dark' : 'light'
  )
  const [dialogOpen, showDialog] = useState(true)
  const [drawerOpen, setDrawer] = useState(false)
  const [popup, setPopup] = useState<TourData | undefined>(undefined)
  const isDesktop = useMediaQuery('(min-width: 1024px)', {
    defaultValue: true,
    initializeWithValue: true,
  })

  const mapRef = createRef<MapRef>()

  // use less padding on small devices
  // because they do not have enough space to fit the popup plus the padding
  const PADDING = useMediaQuery('(max-width: 768px)') ? 10 : 50

  const categorizedData = useMemo(() => {
    return data
      .map((elem) => elem.category)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((category) => {
        const items = data
          .map((elem, idx) => ({
            id: idx,
            ...elem,
          }))
          .filter((elem) => elem.category === category)
          .sort((a, b) => a.title.localeCompare(b.title))

        return { category, items }
      })
  }, [data])

  const menuEntries = useMemo(() => {
    return (
      <div className="flex flex-col gap-6 p-6 pt-0">
        {categorizedData.map(({ category, items }) => (
          <Collapsible key={category} defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center gap-2 text-xl font-bold">
              <MapPin
                size={20}
                color={COLORS[category].stroke}
                fill={COLORS[category].fill}
              />
              {HEADINGS[category]}
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-1">
              <span className="mb-1 mt-3 border-t" />

              {items
                .filter((elem) => ('hide' in elem ? !elem.hide : true))
                .map((elem) => (
                  <Button
                    variant="ghost"
                    key={elem.id}
                    onClick={() => {
                      mapRef.current?.getMap().flyTo({
                        center: [elem.lon, elem.lat],
                        zoom: 16,
                        padding: PADDING,
                      })
                      setPopup(elem)
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1 truncate text-left">
                      {elem.title}
                    </span>
                    {elem.video && (
                      <ImagePlay
                        size={20}
                        className="flex-shrink-0 text-muted-foreground"
                      />
                    )}
                  </Button>
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    )
  }, [PADDING, categorizedData, mapRef])

  const selectCity = useCallback(
    (city: City) => {
      router.push(`/tour/${city}`)
    },
    [router]
  )

  useEffect(() => {
    mapRef.current?.getMap().easeTo({
      center: [center[1], center[0]],
      zoom: 15,
      animate: false,
    })
  }, [center, mapRef])

  const tabs = useMemo(() => {
    return (
      <Tabs defaultValue={city} className="w-full">
        <TabsList className="grid grid-cols-2 gap-2">
          <TabsTrigger
            value="ingolstadt"
            onClick={() => selectCity('ingolstadt')}
          >
            Ingolstadt
          </TabsTrigger>
          <TabsTrigger value="neuburg" onClick={() => selectCity('neuburg')}>
            Neuburg
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }, [city, selectCity])

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={showDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-0">
              Virtuelle Stadt- und Campusführung
            </DialogTitle>
          </DialogHeader>

          <p>
            Klicke auf eine Markierung, um mehr über diesen Ort zu erfahren.
            Viele der Orte haben auch ein kurzes Video.
          </p>
          <p>
            Die virtuelle Stadt- und Campusführung ist ein Projekt der{' '}
            <a
              href="https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung"
              target="_blank"
              rel="noreferrer"
            >
              Fachschaft Informatik
            </a>{' '}
            in Kooperation mit{' '}
            <a
              href="https://neuland-ingolstadt.de"
              target="_blank"
              rel="noreferrer"
            >
              Neuland Ingolstadt
            </a>
            .
          </p>
          <DialogFooter>
            <Button className="w-full" onClick={() => showDialog(false)}>
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} onOpenChange={setDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Virtuelle Stadt- und Campusführung</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>

          <ScrollArea className="flex h-[70vh]">{menuEntries}</ScrollArea>

          <DrawerFooter>
            <DrawerClose>
              <Button variant="destructive">Schließen</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <TourDetails popup={popup} setPopup={setPopup} />

      <div className="flex h-screen max-h-screen w-full flex-row">
        <div
          className={cn('max-h-full w-[360px] border-r', {
            hidden: !isDesktop,
          })}
        >
          <div className="flex flex-col items-center justify-between gap-6 p-6">
            <Link href="/">
              <Image
                src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
                width={200}
                height={85}
                alt="Studierendenvertretung TH Ingolstadt"
              />
            </Link>

            {tabs}

            <Link href="/" passHref className="w-full">
              <Button className="flex w-full items-center gap-2">
                <ChevronsLeft />
                <span>Zurück</span>
              </Button>
            </Link>
          </div>

          <ScrollArea className="flex h-[calc(100%-200px)]">
            {menuEntries}
          </ScrollArea>
        </div>

        <div className="h-full flex-1">
          <ReactMap
            ref={mapRef}
            mapStyle={`https://tile.neuland.app/styles/${mapStyle}/style.json`}
            attributionControl={false}
            initialViewState={{
              latitude: center[0],
              longitude: center[1],
              zoom: 15,
            }}
            boxZoom={false}
            maxPitch={0}
            maxZoom={19}
            minZoom={12}
          >
            {data.map((elem) => (
              <Marker
                key={elem.title}
                latitude={elem.lat}
                longitude={elem.lon}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  mapRef.current?.getMap().flyTo({
                    center: [elem.lon, elem.lat],
                    zoom: 16,
                    padding: PADDING,
                  })
                  setPopup(elem)
                }}
              >
                <MapPin
                  size={24}
                  color={COLORS[elem.category].stroke}
                  fill={COLORS[elem.category].fill}
                />
              </Marker>
            ))}

            <AttributionControl
              attribution={
                <Link
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Map data from © OpenStreetMap
                </Link>
              }
            />
            <MapStyleControl className="mt-10" onStyleChange={setMapStyle} />
          </ReactMap>

          <div
            className={cn(
              'absolute bottom-4 left-6 flex w-[calc(100vw-48px)] gap-3',
              {
                hidden: isDesktop,
              }
            )}
          >
            <div className="flex w-full flex-col gap-2">
              <div className="flex gap-2">
                <Link href="/" passHref>
                  <Button size="icon" variant="secondary" className="shadow">
                    <ChevronsLeft />
                  </Button>
                </Link>

                <Button
                  className="w-full items-center gap-2 bg-primary shadow-lg"
                  onClick={() => setDrawer(true)}
                >
                  <Menu />
                  <span>Menu</span>
                </Button>
              </div>

              {tabs}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
