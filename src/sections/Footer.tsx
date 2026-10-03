import { useRef } from 'react'
import { useInView } from 'motion/react'
import { Lockup } from '../brand/Logo'
import { GENERAL_ENQUIRY, INSTAGRAM_URL, whatsappLink } from '../lib/contact'

const YEAR = new Date().getFullYear()

// Two identical halves so the slow drift loops without a seam.
const SELVEDGE = 'Glamlove Couture\u2003·\u2003'.repeat(16)

export function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <footer className="footer">
      <div className="footer__top">
        <p className="footer__tag">Couture, made to order.</p>
        <ul className="footer__links">
          <li>
            <a className="link" href={whatsappLink(GENERAL_ENQUIRY)} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </li>
          <li>
            <a className="link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a className="link" href="#collection">
              Collection
            </a>
          </li>
          <li>
            <a className="link" href="#atelier">
              Atelier
            </a>
          </li>
        </ul>
      </div>

      <div ref={ref} className="footer__mark" data-in={inView || undefined}>
        <Lockup />
      </div>

      <div className="footer__selvedge" aria-hidden="true">
        <span>
          {SELVEDGE}
          {SELVEDGE}
        </span>
      </div>
      <div className="footer__base">
        <span>© {YEAR} Glamlove</span>
        <a className="link" href="#top">
          Back to top
        </a>
      </div>
    </footer>
  )
}
