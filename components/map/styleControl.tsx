import { Map as MapIcon } from 'lucide-react'
import type { MapStyle } from '@/components/tour/tourMap'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface MapStyleControlProps {
  className?: string
  onStyleChange: (style: MapStyle) => void
}

export default function MapStyleControl({
  className,
  onStyleChange,
}: MapStyleControlProps) {
  return (
    <div className={cn('maplibregl-ctrl-top-right', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="maplibregl-ctrl flex flex-row items-center !rounded-md bg-background p-2">
            <span className="cursor-pointer text-black dark:text-white">
              <MapIcon size={20} />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mr-2 mt-0">
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
  )
}
