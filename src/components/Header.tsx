import { useEffect, useRef, useState, type Ref } from 'react'
import { Lockup } from '../brand/Logo'
import { GENERAL_ENQUIRY, INSTAGRAM_URL, whatsappLink } from '../lib/contact'
import { ArrowUpRight, Close } from './Icons'

type Props = {
  lockupRef: Ref<HTMLSpanElement>
  logoVisible: boolean
}

const LINKS = [
  { href: '#collection', label: 'Collection' },
  { href: '#atelier', label: 'Atelier' },
  { href: '#consultation', label: 'Consultation' },
]

export function Header({ lockupRef, logoVisible }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const opener = menuButton.current
    closeButton.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.documentElement.classList.add('is-locked')
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [menuOpen])

  return (
    <header className="header" data-scrolled={scrolled || undefined}>
      <div className="header__inner">
        <nav className="header__nav" aria-label="Primary">
          {LINKS.slice(0, 2).map((l) => (
            <a key={l.href} className="link" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <button
          ref={menuButton}
          type="button"
          className="header__menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>

        <a className="header__logo" href="#top" aria-label="Glamlove, back to top" data-hidden={!logoVisible || undefined}>
          <Lockup ref={lockupRef} />
        </a>

        <div className="header__actions">
          <a className="link header__ig" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="button button--small" href={whatsappLink(GENERAL_ENQUIRY)} target="_blank" rel="noreferrer">
            <span className="header__cta-long">Book a fitting</span>
            <span className="header__cta-short">Book</span>
          </a>
        </div>
      </div>

      <div id="site-menu" className="menu" role="dialog" aria-modal="true" aria-label="Menu" data-open={menuOpen || undefined} inert={!menuOpen}>
        <div className="menu__top">
          <span className="menu__label">Menu</span>
          <button ref={closeButton} type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Close />
          </button>
        </div>
        <ul className="menu__list">
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ ['--i' as string]: i }}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li style={{ ['--i' as string]: LINKS.length }}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram <ArrowUpRight />
            </a>
          </li>
        </ul>
        <a className="button menu__cta" href={whatsappLink(GENERAL_ENQUIRY)} target="_blank" rel="noreferrer">
          Book a fitting on WhatsApp
        </a>
      </div>
    </header>
  )
}
