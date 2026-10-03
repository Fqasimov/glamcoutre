import { useLayoutEffect, useRef } from 'react'
import { Lockup } from '../brand/Logo'

type Props = {
  /** The header lockup the intro hands off to. */
  getTarget: () => HTMLElement | null
  /** Resolves when the first viewport's image is decoded (the intro waits for it, briefly). */
  heroReady: Promise<unknown>
  /** Fired as the intro starts leaving, so the page can enter underneath it. */
  onReveal: () => void
  onDone: () => void
}

const FLIGHT_MS = 2900
const LETTERS_AT = 1150
const LETTER_STAGGER = 55
const EXIT_MS = 1050

const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)'

type Pt = [number, number]

function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t
  const t3 = t2 * t
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]
}

const smoothstep = (x: number) => x * x * (3 - 2 * x)

/**
 * A wandering flight across the canvas that ends exactly on the butterfly's
 * resting place above the wordmark. Keyframes are spaced by arc length so the
 * speed stays even; the overall easing slows it into the landing.
 */
function flightKeyframes(final: DOMRect, vw: number, vh: number): Keyframe[] {
  const fx = final.left + final.width / 2
  const fy = final.top + final.height / 2
  const waypoints: Pt[] = [
    [-0.12, 0.95],
    [0.16, 0.66],
    [0.27, 0.28],
    [0.55, 0.12],
    [0.82, 0.27],
    [0.8, 0.6],
    [0.56, 0.74],
    [0.3, 0.58],
    [0.33, 0.3],
  ].map(([x, y]) => [x * vw, y * vh] as Pt)
  waypoints.push([fx - final.width * 0.15, fy - final.height * 0.55], [fx, fy])

  const pts = [waypoints[0], ...waypoints, waypoints[waypoints.length - 1]]
  const samples: Pt[] = []
  const PER_SEGMENT = 10
  for (let i = 1; i < pts.length - 2; i++) {
    for (let s = 0; s < PER_SEGMENT; s++) samples.push(catmullRom(pts[i - 1], pts[i], pts[i + 1], pts[i + 2], s / PER_SEGMENT))
  }
  samples.push([fx, fy])

  const lengths = [0]
  for (let i = 1; i < samples.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]))
  }
  const total = lengths[lengths.length - 1]

  // Heading follows the path tangent, unwrapped and softened so the body
  // banks into turns instead of snapping round them.
  const raw: number[] = samples.map((_, i) => {
    const a = samples[Math.max(0, i - 1)]
    const b = samples[Math.min(samples.length - 1, i + 1)]
    return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90
  })
  for (let i = 1; i < raw.length; i++) {
    while (raw[i] - raw[i - 1] > 180) raw[i] -= 360
    while (raw[i] - raw[i - 1] < -180) raw[i] += 360
  }
  const heading = raw.map((_, i) => {
    let sum = 0
    let n = 0
    for (let k = -3; k <= 3; k++) {
      const j = i + k
      if (j >= 0 && j < raw.length) {
        sum += raw[j]
        n++
      }
    }
    return (sum / n) * 0.72
  })

  return samples.map((p, i) => {
    const u = lengths[i] / total
    const land = smoothstep(Math.min(1, Math.max(0, (u - 0.8) / 0.2)))
    const bob = Math.sin(u * Math.PI * 2 * 9) * 7 * (1 - land)
    const depth = 0.56 + Math.sin(u * Math.PI * 2.4) * 0.08
    const scale = depth + (1 - depth) * land
    const rotate = heading[i] * (1 - land)
    const x = (p[0] - fx) * (i === samples.length - 1 ? 0 : 1)
    const y = (p[1] - fy + bob) * (i === samples.length - 1 ? 0 : 1)
    return {
      offset: u,
      transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
    }
  })
}

function flap(wings: Element[], { amplitude, duration, iterations }: { amplitude: number; duration: number; iterations: number }) {
  return wings.map((wing) => {
    const sign = (wing as HTMLElement).dataset.wing === 'l' ? 1 : -1
    return wing.animate(
      [
        { transform: 'rotateY(0deg)' },
        { transform: `rotateY(${sign * amplitude}deg)`, offset: 0.45 },
        { transform: 'rotateY(0deg)' },
      ],
      { duration, iterations, easing: 'ease-in-out' },
    )
  })
}

export function Loader({ getTarget, heroReady, onReveal, onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const lockupRef = useRef<HTMLSpanElement>(null)
  const butterflyRef = useRef<HTMLSpanElement>(null)
  const wordmarkRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const veil = veilRef.current!
    const lockup = lockupRef.current!
    const butterfly = butterflyRef.current!
    const wordmark = wordmarkRef.current!
    const letters = Array.from(wordmark.querySelectorAll('.wordmark__letter'))
    const wings = Array.from(butterfly.querySelectorAll('[data-wing]'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const root = document.documentElement
    root.classList.add('is-intro')

    let running: Animation[] = []
    const timers: number[] = []
    let exiting = false
    let cancelled = false
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const waitForHero = Promise.race([heroReady, new Promise((r) => setTimeout(r, 1800))])

    const finish = () => {
      if (cancelled) return
      root.classList.remove('is-intro')
      onDone()
    }

    const exit = (fast: boolean) => {
      if (exiting) return
      exiting = true
      timers.forEach(clearTimeout)
      running.forEach((a) => {
        // Infinite animations cannot be finished, only cancelled back to rest.
        try {
          a.finish()
        } catch {
          a.cancel()
        }
      })
      running = []
      onReveal()

      if (reduce) {
        lockup.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })
        veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(finish)
        return
      }

      const target = getTarget()
      const from = lockup.getBoundingClientRect()
      const duration = fast ? 650 : EXIT_MS
      if (target) {
        const to = target.getBoundingClientRect()
        const dx = to.left + to.width / 2 - (from.left + from.width / 2)
        const dy = to.top + to.height / 2 - (from.top + from.height / 2)
        const s = to.width / from.width
        lockup.animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }], {
          duration,
          easing: EASE_IN_OUT,
          fill: 'forwards',
        })
      } else {
        lockup.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration * 0.6, fill: 'forwards' })
      }
      veil
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: duration * 0.7,
          delay: duration * 0.22,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        })
        .finished.then(() => later(duration * 0.1, finish))
    }

    if (reduce) {
      running.push(lockup.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out', fill: 'backwards' }))
      later(1100, () => waitForHero.then(() => exit(false)))
    } else {
      const final = butterfly.getBoundingClientRect()
      const flight = butterfly.animate(flightKeyframes(final, window.innerWidth, window.innerHeight), {
        duration: FLIGHT_MS,
        easing: 'cubic-bezier(0.42, 0.05, 0.22, 1)',
        fill: 'backwards',
      })
      const flapping = flap(wings, { amplitude: 74, duration: 210, iterations: Infinity })
      running.push(flight, ...flapping)

      letters.forEach((letter, i) => {
        running.push(
          letter.animate([{ transform: 'translateY(320px)' }, { transform: 'translateY(0px)' }], {
            duration: 1100,
            delay: LETTERS_AT + i * LETTER_STAGGER,
            easing: EASE_OUT_EXPO,
            fill: 'backwards',
          }),
        )
      })

      // Wings slow as she glides in, settle with two lazy beats, then rest open.
      later(FLIGHT_MS - 650, () => flapping.forEach((a) => a.updatePlaybackRate(0.55)))
      later(FLIGHT_MS - 120, () => {
        flapping.forEach((a) => {
          const iteration = a.effect?.getComputedTiming().currentIteration ?? 0
          a.effect?.updateTiming({ iterations: iteration + 1 })
        })
      })
      later(FLIGHT_MS + 260, () => {
        running.push(...flap(wings, { amplitude: 38, duration: 620, iterations: 2 }))
      })
      later(FLIGHT_MS + 1500, () => waitForHero.then(() => exit(false)))
    }

    const skip = () => exit(true)
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchmove', skip, { passive: true })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      running.forEach((a) => a.cancel())
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
      root.classList.remove('is-intro')
    }
    // The intro runs once per mount; callbacks are read at call time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className="loader" aria-hidden="true">
      <div ref={veilRef} className="loader__veil" />
      <Lockup ref={lockupRef} butterflyRef={butterflyRef} wordmarkRef={wordmarkRef} className="loader__lockup" />
    </div>
  )
}
