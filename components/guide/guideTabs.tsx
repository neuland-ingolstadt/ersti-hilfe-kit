import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const TABS = [
  {
    title: 'Studium',
    link: '/guide/studies',
  },
  {
    title: 'Leben',
    link: '/guide/life',
  },
  {
    title: 'Campus',
    link: '/guide/campus',
  },
  {
    title: 'Glossar',
    link: '/guide/glossary',
  },
]

export default function GuideTabs() {
  const router = useRouter()

  const { pathname } = router

  // prefetch all tabs
  useEffect(() => {
    for (const tab of TABS) {
      router.prefetch(tab.link)
    }
  }, [router])

  return (
    <Tabs defaultValue={pathname} className="mb-6 w-full">
      <TabsList className="grid grid-cols-4">
        {TABS.map((link) => (
          <TabsTrigger
            key={link.title}
            value={link.link}
            onClick={(e) => {
              e.preventDefault()
              router.replace(link.link)
            }}
          >
            {link.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
