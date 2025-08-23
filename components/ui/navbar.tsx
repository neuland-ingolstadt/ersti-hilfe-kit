import { useAptabase } from '@aptabase/react'
import { Palette, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface NavBarProps {
  overlay?: boolean
}

export default function NavBar({ overlay = false }: NavBarProps) {
  const { setTheme } = useTheme()
  const { trackEvent } = useAptabase()

  const updateTheme = useCallback(
    (theme: 'light' | 'dark' | 'system') => {
      setTheme(theme)
      trackEvent('Change Theme', {
        theme,
      })
    },
    [setTheme, trackEvent]
  )

  return (
    <>
      <div className="fixed left-0 top-0 z-50 mb-16 w-screen border-b bg-background shadow-xs">
        <div className="container flex h-16 items-center">
          <Link href="/" passHref>
            <Image
              src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
              alt="Neuland e.V. Logo"
              priority
              width={120}
              height={35}
              className="shrink-0 cursor-pointer"
            />
          </Link>

          <span className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8">
                <Settings className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Palette className="mr-2 h-4 w-4" />
                    <p>Design</p>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => updateTheme('light')}>
                        Hell
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTheme('dark')}>
                        Dunkel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateTheme('system')}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <span className={cn('block h-16', { hidden: overlay })} />
    </>
  )
}
