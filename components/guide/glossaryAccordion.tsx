import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { COMPONENTS } from '@/components/ui/markdownComponents'
import ReactMarkdown from 'react-markdown'

export interface GlossaryItem {
  title: string
  content: string
}

interface GlossaryAccordionProps {
  glossary: GlossaryItem[]
}

export default function GlossaryAccordion({
  glossary,
}: GlossaryAccordionProps) {
  return (
    <Accordion type="single" collapsible>
      {glossary.map((item) => (
        <AccordionItem value={item.title} key={item.title}>
          <AccordionTrigger className="max-w-full py-6">
            <div className="truncate pr-6">{item.title}</div>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            <ReactMarkdown components={COMPONENTS}>
              {item.content}
            </ReactMarkdown>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
