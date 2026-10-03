import { useRef } from 'react'
import { useInView } from 'motion/react'
import { PatternPiece, type Notch } from '../components/PatternPiece'
import { LOOKS, src, srcSet, type Look } from '../data/looks'
import type { OpenLook } from '../App'

type Props = { onOpen: OpenLook }

// Notch marks vary piece to piece, like a real marker of pattern pieces.
const NOTCHES: Notch[][] = [
  [{ side: 'left', at: 0.3 }, { side: 'right', at: 0.56, double: true }],
  [{ side: 'top', at: 0.5 }, { side: 'left', at: 0.62 }],
  [{ side: 'right', at: 0.34 }, { side: 'bottom', at: 0.5, double: true }],
  [{ side: 'left', at: 0.46, double: true }],
  [{ side: 'top', at: 0.38 }, { side: 'right', at: 0.7 }],
  [{ side: 'left', at: 0.28 }, { side: 'bottom', at: 0.62 }],
  [{ side: 'right', at: 0.42, double: true }, { side: 'top', at: 0.5 }],
  [{ side: 'left', at: 0.52 }],
  [{ side: 'right', at: 0.3 }, { side: 'left', at: 0.66, double: true }],
]

function LookItem({ look, index, onOpen }: { look: Look; index: number; onOpen: OpenLook }) {
  const ref = useRef<HTMLLIElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const view = look.views[0]

  return (
    <li ref={ref} className={`look look--${index + 1}`}>
      <button type="button" className="piece-button" onClick={() => onOpen(index, 0, img.current)} aria-label={`Open Look ${look.no}, ${look.name}`}>
        <PatternPiece drawn={inView} notches={NOTCHES[index]} delay={(index % 3) * 90}>
          <img
            ref={img}
            src={src(view.file, 640)}
            srcSet={srcSet(view.file)}
            sizes="(min-width: 1024px) 34vw, 46vw"
            width={view.w}
            height={view.h}
            alt={view.alt}
            loading="lazy"
            decoding="async"
            style={{ backgroundColor: view.bg }}
          />
        </PatternPiece>
      </button>
      <div className="look__caption">
        <span className="look__no">Look {look.no}</span>
        <span className="look__name">{look.name}</span>
        <span className="look__details">{look.details.join(' · ')}</span>
      </div>
    </li>
  )
}

export function Collection({ onOpen }: Props) {
  return (
    <section className="collection" id="collection" aria-labelledby="collection-title">
      <div className="selvedge" aria-hidden="true">
        <span>Selvedge</span>
      </div>
      <header className="section-head">
        <h2 id="collection-title" className="section-title">
          The collection
        </h2>
        <p className="section-lede">
          Nine looks from the atelier, each one a starting point. Open a piece to see it closer, or ask about it on WhatsApp.
        </p>
      </header>
      <ul className="marker">
        {LOOKS.map((look, i) => (
          <LookItem key={look.id} look={look} index={i} onOpen={onOpen} />
        ))}
      </ul>
      <div className="selvedge selvedge--bottom" aria-hidden="true">
        <span>Selvedge</span>
      </div>
    </section>
  )
}
