import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from 'motion/react'
import { BUTTERFLY } from '../brand/marks'

const STEPS = [
  {
    title: 'Consultation',
    text: 'We meet at the atelier and talk it through: the occasion, the silhouette you love, the fabrics that suit it. Your measurements are taken.',
  },
  {
    title: 'Pattern',
    text: 'A pattern is drafted from your measurements, for your body and no one else’s.',
  },
  {
    title: 'Toile',
    text: 'A first version is made in plain cotton and fitted on you, so the line is right before the real fabric is cut.',
  },
  {
    title: 'The gown',
    text: 'The gown is cut, draped and finished in the atelier, with fittings until it sits exactly as it should.',
  },
]

// A front bodice block, drafted in a 420 × 560 sheet. Centre front runs down the left edge.
const OUTLINE = 'M70 132C118 130 160 108 168 58L318 92C302 160 300 238 352 262L340 500L236 506L206 330L176 508L70 512Z'
const SEAM = 'M70 132C118 130 160 108 168 58L318 92C302 160 300 238 352 262L340 500L70 512Z'
const GUIDES = ['M34 300H392', 'M34 512H392', 'M70 28V544', 'M168 30V96']
const NOTCHES = ['M300 168l14 -4', 'M302 176l14 -4', 'M340 392l14 1', 'M56 320h14']

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The drawing is driven straight from scroll progress. Each mark declares when
 * it draws (`data-draw="start,span"`, stroke drawn on) or appears
 * (`data-fade="from,to"`), as fractions of the stages' scroll.
 */
function Drafting({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const draws = Array.from(svg.querySelectorAll<SVGElement>('[data-draw]')).map((el) => {
      const [start, span] = el.dataset.draw!.split(',').map(Number)
      return { el, start, span }
    })
    const fades = Array.from(svg.querySelectorAll<SVGElement>('[data-fade]')).map((el) => {
      const [from, to] = el.dataset.fade!.split(',').map(Number)
      return { el, from, to, grow: el.hasAttribute('data-grow') }
    })
    const apply = (p: number) => {
      for (const d of draws) d.el.style.strokeDashoffset = String(still ? 0 : 1 - clamp01((p - d.start) / d.span))
      for (const f of fades) {
        const v = still ? 1 : clamp01((p - f.from) / (f.to - f.from))
        f.el.style.opacity = String(v)
        if (f.grow) f.el.style.transform = `scale(${0.9 + 0.1 * v})`
      }
    }
    apply(progress.get())
    return progress.on('change', apply)
  }, [progress, still])

  const draw = { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 }

  return (
    <svg ref={ref} className="draft" viewBox="0 0 420 560" role="img" aria-label="A front bodice pattern, drawn step by step">
      <defs>
        <mask id="draft-guides" maskUnits="userSpaceOnUse">
          {GUIDES.map((d) => (
            <path key={d} d={d} stroke="#fff" strokeWidth={6} fill="none" data-draw="0.02,0.18" {...draw} />
          ))}
        </mask>
        <mask id="draft-seam" maskUnits="userSpaceOnUse">
          <path
            d={SEAM}
            transform="translate(-12.6 -18) scale(1.06)"
            stroke="#fff"
            strokeWidth={8}
            fill="none"
            data-draw="0.52,0.18"
            {...draw}
          />
        </mask>
      </defs>

      <g className="draft__guides" mask="url(#draft-guides)">
        {GUIDES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="draft__labels" data-fade="0.13,0.2" opacity={0}>
        <text x="392" y="292" textAnchor="end">
          Bust
        </text>
        <text x="392" y="532" textAnchor="end">
          Waist
        </text>
        <text x="78" y="40">
          CF
        </text>
        <path className="draft__cross" d="M200 300h12M206 294v12" />
      </g>

      <path className="draft__outline" d={OUTLINE} data-draw="0.27,0.2" {...draw} />

      <g mask="url(#draft-seam)">
        <path className="draft__seam" d={SEAM} transform="translate(-12.6 -18) scale(1.06)" vectorEffect="non-scaling-stroke" />
      </g>
      <g className="draft__notches" data-fade="0.65,0.7" opacity={0}>
        {NOTCHES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <path className="draft__grain" d="M140 196V452M134 208l6-12 6 12M134 440l6 12 6-12" data-draw="0.77,0.1" {...draw} />
      <g className="draft__labels" data-fade="0.82,0.92" opacity={0}>
        <text x="152" y="324" transform="rotate(-90 152 324)">
          Grain
        </text>
        <text x="236" y="230" textAnchor="middle" className="draft__piece-name">
          Front
        </text>
        <text x="236" y="252" textAnchor="middle">
          Cut 1 self
        </text>
        <path d="M58 168H46V476H58M50 176l-4-8-4 8M50 468l-4 8-4-8" className="draft__fold" />
        <text x="36" y="322" transform="rotate(-90 36 322)" textAnchor="middle">
          Place on fold
        </text>
      </g>
      <g className="draft__stamp-group" data-fade="0.88,0.97" data-grow opacity={0}>
        <svg x="240" y="410" width="60" height="48" viewBox={BUTTERFLY.viewBox} className="draft__stamp">
          <path d={BUTTERFLY.d} fillRule="evenodd" />
        </svg>
      </g>
    </svg>
  )
}

export function Atelier() {
  const stepsRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 70%', 'end 65%'] })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length))))
  })

  return (
    <section className="atelier" id="atelier" aria-labelledby="atelier-title">
      <header className="section-head">
        <h2 id="atelier-title" className="section-title">
          From pattern to gown
        </h2>
        <p className="section-lede">Nothing comes off a rail. Each gown is made in four stages, and you are part of every one.</p>
      </header>

      <div className="atelier__body">
        <div className="atelier__board">
          <div className="atelier__sheet">
            <Drafting progress={scrollYProgress} still={reduce} />
          </div>
        </div>
        <ol ref={stepsRef} className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step" data-active={i === active || undefined}>
              <span className="step__no annot-text">Stage {i + 1}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
