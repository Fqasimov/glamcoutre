import type { CSSProperties, Ref } from 'react'
import { BUTTERFLY, WORDMARK } from './marks'

type ButterflyProps = {
  className?: string
  ref?: Ref<HTMLSpanElement>
  style?: CSSProperties
}

/**
 * The butterfly mark, split down the body into two wings so each can hinge
 * in 3D. Both halves render the full traced path and clip to their side.
 */
export function Butterfly({ className, ref, style }: ButterflyProps) {
  const svg = (
    <svg viewBox={BUTTERFLY.viewBox} aria-hidden="true" focusable="false">
      <path d={BUTTERFLY.d} fillRule="evenodd" />
    </svg>
  )
  return (
    <span ref={ref} className={['bfly', className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
      <span className="bfly__wing bfly__wing--l" data-wing="l">
        {svg}
      </span>
      <span className="bfly__wing bfly__wing--r" data-wing="r">
        {svg}
      </span>
    </span>
  )
}

type WordmarkProps = {
  className?: string
  ref?: Ref<SVGSVGElement>
  title?: string
}

export function Wordmark({ className, ref, title = 'Glamlove' }: WordmarkProps) {
  return (
    <svg ref={ref} className={['wordmark', className].filter(Boolean).join(' ')} viewBox={WORDMARK.viewBox} role="img" aria-label={title}>
      {WORDMARK.letters.map((d, i) => (
        <path key={i} className="wordmark__letter" d={d} fillRule="evenodd" />
      ))}
    </svg>
  )
}

type LockupProps = {
  className?: string
  ref?: Ref<HTMLSpanElement>
  butterflyRef?: Ref<HTMLSpanElement>
  wordmarkRef?: Ref<SVGSVGElement>
  style?: CSSProperties
}

/** Butterfly above the wordmark, in the proportions of the original logo. */
export function Lockup({ className, ref, butterflyRef, wordmarkRef, style }: LockupProps) {
  return (
    <span ref={ref} className={['lockup', className].filter(Boolean).join(' ')} style={style}>
      <Butterfly ref={butterflyRef} className="lockup__mark" />
      <Wordmark ref={wordmarkRef} className="lockup__word" />
    </span>
  )
}
