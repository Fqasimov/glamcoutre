import { useRef } from 'react'
import { PatternPiece } from '../components/PatternPiece'
import { ArrowRight } from '../components/Icons'
import { HERO_IMAGE, LOOKS, src, srcSet } from '../data/looks'
import { GENERAL_ENQUIRY, whatsappLink } from '../lib/contact'
import type { OpenLook } from '../App'

type Props = { ready: boolean; onOpen: OpenLook }

const look = LOOKS[0]
const front = look.views[0]
const back = look.views[2]

export function Hero({ ready, onOpen }: Props) {
  const frontImg = useRef<HTMLImageElement>(null)
  const backImg = useRef<HTMLImageElement>(null)

  return (
    <section className="hero" id="top" data-ready={ready || undefined} aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title" className="hero__title">
          <span className="rise">
            <span>Gowns cut</span>
          </span>
          <span className="rise">
            <span>for one.</span>
          </span>
        </h1>
        <p className="hero__lede">
          Glamlove is a couture atelier. Every gown begins as a pattern drafted for one woman, then is cut, draped and
          fitted until it is hers alone.
        </p>
        <div className="hero__actions">
          <a className="button" href={whatsappLink(GENERAL_ENQUIRY)} target="_blank" rel="noreferrer">
            Book a fitting <ArrowRight />
          </a>
          <a className="link" href="#collection">
            See the collection
          </a>
        </div>
      </div>

      <figure className="hero__main">
        <button
          type="button"
          className="piece-button"
          onClick={() => onOpen(0, 0, frontImg.current)}
          aria-label={`Open Look ${look.no}, ${look.name}`}
        >
          <PatternPiece
            drawn={ready}
            delay={250}
            notches={[
              { side: 'left', at: 0.32 },
              { side: 'left', at: 0.64 },
              { side: 'right', at: 0.44, double: true },
              { side: 'top', at: 0.5 },
            ]}
          >
            <img
              ref={frontImg}
              src={HERO_IMAGE}
              srcSet={srcSet(front.file)}
              sizes="(min-width: 1024px) 40vw, 92vw"
              width={front.w}
              height={front.h}
              alt={front.alt}
              style={{ backgroundColor: front.bg }}
              fetchPriority="high"
            />
          </PatternPiece>
        </button>
        <svg className="grainline" viewBox="0 0 16 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M8 2V398" pathLength={1} />
          <path d="M2 14 8 2l6 12M2 386l6 12 6-12" pathLength={1} />
        </svg>
        <figcaption className="annot">
          <span>Look {look.no} — {front.label}</span>
          <span>Cut 1 self</span>
        </figcaption>
      </figure>

      <figure className="hero__side">
        <button
          type="button"
          className="piece-button"
          onClick={() => onOpen(0, 2, backImg.current)}
          aria-label={`Open Look ${look.no}, ${look.name}, back view`}
        >
          <PatternPiece drawn={ready} delay={520} allowance={8} notches={[{ side: 'left', at: 0.44, double: true }, { side: 'bottom', at: 0.5 }]}>
            <img
              ref={backImg}
              src={src(back.file, 640)}
              srcSet={srcSet(back.file)}
              sizes="(min-width: 1024px) 22vw, 40vw"
              width={back.w}
              height={back.h}
              alt={back.alt}
              style={{ backgroundColor: back.bg }}
            />
          </PatternPiece>
        </button>
        <figcaption className="annot">
          <span>{back.label}</span>
          <span>Cut 1 self</span>
        </figcaption>
      </figure>
    </section>
  )
}
