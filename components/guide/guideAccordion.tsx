import { useAptabase } from '@aptabase/react'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { COMPONENTS } from '@/components/ui/markdownComponents'

export interface GuideSection {
  category: string
  title: string
  content: GuideItem[]
}

export interface GuideItem {
  title: string
  content: string
  link: string
  linktitle?: string
}

interface GuideAccordionProps {
  guide: GuideSection[]
}

export default function GuideAccordion({ guide }: GuideAccordionProps) {
  const { trackEvent } = useAptabase()
  const router = useRouter()
  const page = useMemo(
    () => router.pathname.replace('/guide/', ''),
    [router.pathname]
  )

  return (
    <Accordion
      type="single"
      collapsible
      onValueChange={(value) => {
        if (!value) return
        trackEvent('Guide Accordion', { page, section: value })
      }}
    >
      {guide.map((item) => (
        <AccordionItem value={item.title} key={item.title}>
          <AccordionTrigger className="max-w-full pt-8">
            <div className="max-w-full truncate pr-6 text-left">
              {item.title}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="px-6 py-3">
                <Accordion
                  type="single"
                  collapsible
                  onValueChange={() => {
                    if (!item.title) return
                    trackEvent('Guide Sub Accordion', { section: item.title })
                  }}
                >
                  {item.content.map((content) => (
                    <AccordionItem value={content.title} key={content.title}>
                      <AccordionTrigger className="max-w-full pt-8">
                        <div className="max-w-full truncate pr-6 text-left text-base">
                          {content.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-base">
                        <ReactMarkdown components={COMPONENTS}>
                          {content.content}
                        </ReactMarkdown>
                        {content.link.length > 0 && (
                          <Link
                            href={content.link}
                            target="_blank"
                            passHref
                            className="text-primary"
                          >
                            <Button variant="link">
                              <ExternalLink />
                              <span>{content.linktitle}</span>
                            </Button>
                          </Link>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
