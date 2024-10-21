import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { COMPONENTS } from '@/components/ui/markdownComponents'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

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
  return (
    <Accordion
      type="single"
      collapsible
    >
      {guide.map((item) => (
        <AccordionItem
          value={item.title}
          key={item.title}
        >
          <AccordionTrigger className="py-6">{item.title}</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="px-6 py-3">
                <Accordion
                  type="single"
                  collapsible
                >
                  {item.content.map((content) => (
                    <AccordionItem
                      value={content.title}
                      key={content.title}
                    >
                      <AccordionTrigger>{content.title}</AccordionTrigger>
                      <AccordionContent>
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
