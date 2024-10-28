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
import { Palette, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

interface NavBarProps {
  overlay?: boolean
}

export default function NavBar({ overlay = false }: NavBarProps) {
  const { setTheme } = useTheme()

  return (
    <>
      <div className="fixed left-0 top-0 z-50 mb-16 w-screen border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center">
          <Link
            href="/"
            passHref
          >
            <Image
              src="https://assets.neuland.app/StudVer_Logo_2020_CMYK.svg"
              alt="Neuland e.V. Logo"
              priority
              width={120}
              height={35}
              className="flex-shrink-0 cursor-pointer"
            />
          </Link>

          <span className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              forceMount
            >
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Palette className="mr-2 h-4 w-4" />
                    <p>Design</p>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        Hell
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dunkel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTheme('system')}>
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
