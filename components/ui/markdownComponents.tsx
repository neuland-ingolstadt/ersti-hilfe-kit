import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Components } from 'react-markdown'

export const COMPONENTS: Components = {
  a(props) {
    if (!props.href) {
      return null
    }

    return (
      <span className="inline-flex items-center gap-1 text-primary hover:underline">
        <ExternalLink size={12} />
        <Link target="_blank" rel="noopener" href={props.href} {...props} />
      </span>
    )
  },
  ol(props) {
    return (
      <ol className="list-decimal pl-6" {...props}>
        {props.children}
      </ol>
    )
  },
  ul(props) {
    return (
      <ul className="list-disc pl-6" {...props}>
        {props.children}
      </ul>
    )
  },
}
