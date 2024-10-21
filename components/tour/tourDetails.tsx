import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { COMPONENTS } from '@/components/ui/markdownComponents'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTourDetails } from '@/lib/hooks/tourDetails'
import { cn } from '@/lib/utils'
import { TourData } from '@/pages/tour/[city]'
import { useMediaQuery } from 'usehooks-ts'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { SiApple, SiGooglemaps, SiOpenstreetmap } from 'react-icons/si'
import ReactMarkdown from 'react-markdown'

interface TourDialogProps {
  popup: TourData | undefined
  setPopup: (popup: TourData | undefined) => void
}

export default function TourDetails({ popup, setPopup }: TourDialogProps) {
  const open = useMemo(() => !!popup, [popup])
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) setPopup(undefined)
    },
    [setPopup]
  )

  const { osmLink, googleMapsLink, appleMapsLink, description } =
    useTourDetails(popup!)

  const body = useMemo(() => {
    if (!popup) return null

    return (
      <div className="flex flex-col gap-3">
        {description && (
          <div>
            <ReactMarkdown components={COMPONENTS}>{description}</ReactMarkdown>
          </div>
        )}
        {popup.video && (
          <video
            poster={popup.poster}
            controls
            className="rounded-md"
          >
            <source
              src={popup.video}
              type="video/mp4"
            />
          </video>
        )}
      </div>
    )
  }, [description, popup])

  if (!popup) return null

  if (!isDesktop) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="!mb-0 !pb-0">
          <DrawerHeader>
            <DrawerTitle>{popup.title}</DrawerTitle>
          </DrawerHeader>

          <div className="px-6">
            <ScrollArea className="h-[70vh]">
              <>
                {body}
                <span className="block h-16" />
              </>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={cn({
          'max-w-6xl': popup.video,
        })}
      >
        <DialogTitle className="mb-0 text-xl">{popup.title}</DialogTitle>

        {body}

        <DialogFooter className="grid grid-cols-3 gap-3">
          <Link
            href={osmLink}
            target="_blank"
            passHref
          >
            <Button
              className="w-full"
              variant="secondary"
            >
              <SiOpenstreetmap />
              <span>OpenStreetMap</span>
            </Button>
          </Link>

          <Link
            href={googleMapsLink}
            target="_blank"
            passHref
          >
            <Button
              className="w-full"
              variant="secondary"
            >
              <SiGooglemaps />
              <span>Google Maps</span>
            </Button>
          </Link>

          <Link
            href={appleMapsLink}
            target="_blank"
            passHref
          >
            <Button
              className="w-full"
              variant="secondary"
            >
              <SiApple />
              <span>Maps</span>
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
