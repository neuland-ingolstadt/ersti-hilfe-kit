import { useMap } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CircleChevronRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AttributionControlProps {
  attribution: string | React.ReactNode
}

export function AttributionControl({ attribution }: AttributionControlProps) {
  const [collapsed, setCollapsed] = useState(false)
  const map = useMap().current

  const attributionRef = useRef<HTMLDivElement>(null)
  const [targetWidth, setTargetWidth] = useState(0)

  useEffect(() => {
    function getTargetWidth() {
      if (!attributionRef.current) {
        return
      }

      attributionRef.current.style.width = 'auto'
      const width = attributionRef.current.offsetWidth + 6
      attributionRef.current.style.width = width + 'px'

      attributionRef.current.style.transition =
        'width 0.3s ease-in-out, opacity 0.3s ease-in-out'

      setTargetWidth(width)
    }

    getTargetWidth()
  }, [attributionRef])

  const toggleCollapsed = useCallback(
    (value?: boolean) => {
      if (!attributionRef.current) {
        return
      }

      const collapsedTemp = value ?? !collapsed

      if (value !== undefined) {
        setCollapsed(value)
      } else {
        setCollapsed((prev) => !prev)
      }

      if (!collapsedTemp) {
        attributionRef.current.style.width = targetWidth + 'px'
        attributionRef.current.style.opacity = '1'
      } else {
        attributionRef.current.style.width = '0px'
        attributionRef.current.style.opacity = '0'
      }
    },
    [collapsed, targetWidth]
  )

  useEffect(() => {
    if (!map) {
      return
    }

    map.on('move', () => {
      toggleCollapsed(true)
    })
  }, [collapsed, map, toggleCollapsed])

  useEffect(() => {
    // close attribution after 5 seconds
    const timeout = setTimeout(() => {
      toggleCollapsed(true)
    }, 5000)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!map) {
    return null
  }

  return (
    <div className="maplibregl-ctrl-top-right">
      <div className="maplibregl-ctrl flex flex-row items-center !rounded-md bg-background p-2">
        <div className="overflow-x-hidden whitespace-nowrap text-opacity-100 transition-all duration-300">
          <div ref={attributionRef}>{attribution}</div>
        </div>

        <span
          onClick={(e) => {
            e.preventDefault()
            toggleCollapsed()
          }}
          className="cursor-pointer text-black dark:text-white"
        >
          <div
            className={cn('rotate-180 transition-all duration-300', {
              'rotate-0': collapsed,
            })}
          >
            {collapsed ? <Info size={20} /> : <CircleChevronRight size={20} />}
          </div>
        </span>
      </div>
    </div>
  )
}
