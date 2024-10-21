import { MapStyle } from '@/components/TourMap'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Map } from 'lucide-react'
import { useCallback } from 'react'
import { useMap } from 'react-map-gl/dist/esm/exports-maplibre'

interface MapStyleControlProps {
  className?: string
  onStyleChange: (style: MapStyle) => void
}

export default function MapStyleControl({
  className,
  onStyleChange,
}: MapStyleControlProps) {
  const map = useMap().current

  return (
    <div className={cn('maplibregl-ctrl-top-right', className)}>
      <div className="maplibregl-ctrl flex flex-row items-center !rounded-md bg-background p-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="cursor-pointer text-black dark:text-white">
              <Map size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="-mr-2 mt-2"
          >
            <DropdownMenuLabel>Kartenstil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStyleChange('bright')}>
              Standard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStyleChange('light')}>
              Modern Hell
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStyleChange('dark')}>
              Modern Dunkel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
