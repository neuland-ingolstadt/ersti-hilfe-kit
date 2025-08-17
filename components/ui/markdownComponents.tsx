import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const COMPONENTS = {
  a(props: Omit<React.ComponentProps<'a'>, 'ref'>) {
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
}
