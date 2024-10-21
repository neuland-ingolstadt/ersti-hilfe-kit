import React, { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import rawData from '../../data/guide/glossary.json'
import GuideTabs from '@/components/guide/guideTabs'
import NavBar from '@/components/ui/navbar'
import GlossaryAccordion, {
  GlossaryItem,
} from '@/components/guide/glossaryAccordion'
import { GetServerSideProps } from 'next'
import Footer from '@/components/ui/footer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface GlossaryProps {
  data: GlossaryItem[]
  searchQuery?: string
}

export default function GlossaryGuide({ data, searchQuery }: GlossaryProps) {
  const [search, setSearch] = useState(searchQuery || '')

  const updateQuery = useCallback((value: string) => {
    if (!value) {
      window.history.pushState({}, '', '/guide/glossary')
      return
    }

    window.history.pushState({}, '', `/guide/glossary?search=${value}`)
  }, [])

  const handleSearch = useCallback(
    (value: string) => {
      updateQuery(value)
      setSearch(value)
    },
    [updateQuery]
  )

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  return (
    <div className="container flex h-screen max-h-screen flex-col gap-3">
      <Head>
        <title>Studienguide</title>
      </Head>

      <NavBar />

      <main className="flex-1">
        <GuideTabs />

        <h2>Glossar</h2>

        <p>
          Damit du dich in der “Hochschulsprache“ gut zurechtfindest, haben wir
          ein Glossar angelegt, in dem wir dir Abkürzungen, Begriffe und
          Formulierungen kurz und knapp erläutern.
        </p>

        <Input
          placeholder="Suche im Glossar"
          value={search}
          className="my-3"
          onChange={(e) => handleSearch(e.target.value)}
          icon={<Search size={16} />}
        />

        <ScrollArea className="h-[calc(100vh-400px)] pr-6">
          <GlossaryAccordion glossary={filteredData} />
        </ScrollArea>
      </main>

      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<GlossaryProps> = async ({
  query,
}) => {
  const sortedData = rawData.sort((a, b) => a.title.localeCompare(b.title))

  const { search } = query
  console.log(query)

  const searchQuery = Array.isArray(search) ? search[0] : search || ''

  return {
    props: {
      data: sortedData,
      searchQuery,
    },
  }
}
