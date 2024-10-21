import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex flex-col items-center border-t py-4 md:flex-row md:justify-between">
      <div>
        <p>
          Ein Projekt der{' '}
          <Link
            href="https://studverthi.de"
            target="_blank"
            rel="noreferrer"
          >
            Fachschaft Informatik (StudVer)
          </Link>{' '}
          in Kooperation mit{' '}
          <Link
            href="https://neuland-ingolstadt.de"
            target="_blank"
            rel="noreferrer"
          >
            Neuland Ingolstadt e.V.
          </Link>
        </p>
        <p>
          Wir würden uns über euer Feedback freuen &ndash; entweder über Discord
          oder <a href="mailto:info@neuland-ingolstadt.de">per E-Mail</a>.
        </p>
      </div>

      <ul className="flex list-disc flex-col text-center md:text-right">
        <Link
          href="https://github.com/neuland-ingolstadt/ersti-hilfe-kit"
          target="_blank"
          rel="noreferrer"
          passHref
        >
          <Button variant="link">Quellcode</Button>
        </Link>
        <Link
          href="https://neuland-ingolstadt.de/impressum.htm"
          target="_blank"
          rel="noreferrer"
          passHref
        >
          <Button variant="link">Impressum und Datenschutz</Button>
        </Link>
      </ul>
    </footer>
  )
}
