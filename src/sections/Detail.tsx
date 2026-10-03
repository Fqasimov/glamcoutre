import { useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { LOOKS, src, srcSet } from '../data/looks'

const view = LOOKS[0].views[1]

/** A quiet, full-width pause between the collection and the atelier. */
export function Detail() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const img = useRef<HTMLImageElement>(null)

  // A slow drift against the scroll; the frame stays put, the photograph moves within it.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (img.current && !reduce) img.current.style.transform = `translate3d(0, ${(v * 14 - 7).toFixed(2)}%, 0)`
  })

  return (
    <section ref={ref} className="detail" aria-label="Detail">
      <p className="detail__line">
        Made to order.
        <br />
        Fitted to you.
      </p>
      <figure className="detail__figure">
        <div className="detail__frame">
          <img
            ref={img}
            src={src(view.file, 1200)}
            srcSet={srcSet(view.file)}
            sizes="100vw"
            width={view.w}
            height={view.h}
            alt="Close view of the sunburst pleating on the teal gown, with the sheer stole falling beside it"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="annot">
          <span>Look 01 — Pleating, detail</span>
          <span>Shown with stole</span>
        </figcaption>
      </figure>
    </section>
  )
}
