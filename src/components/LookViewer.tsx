import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LOOKS, enquiryFor, src, srcSet } from '../data/looks'
import { whatsappLink } from '../lib/contact'
import { ArrowLeft, ArrowRight, Close } from './Icons'

export type ViewerState = {
  look: number
  view: number
  /** The thumbnail the viewer grew out of, so it can return there. */
  source: HTMLElement | null
}

type Props = {
  state: ViewerState
  onNavigate: (look: number, view: number) => void
  /** Called when a close is requested (button, Esc, back). The viewer animates out, then calls onClosed. */
  closing: boolean
  onRequestClose: () => void
  onClosed: () => void
}

const OPEN_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'
const CLOSE_EASE = 'cubic-bezier(0.77, 0, 0.175, 1)'

function flipFrom(from: DOMRect, to: DOMRect) {
  const sx = from.width / to.width
  const sy = from.height / to.height
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`
}

export function LookViewer({ state, onNavigate, closing, onRequestClose, onClosed }: Props) {
  const look = LOOKS[state.look]
  const view = look.views[Math.min(state.view, look.views.length - 1)]
  const rootRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const origin = useRef({ look: state.look, view: state.view, source: state.source })
  const [swapping, setSwapping] = useState(false)
  const [fresh, setFresh] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Open: the photograph grows out of the piece that was tapped.
  useLayoutEffect(() => {
    const img = imgRef.current!
    const veil = veilRef.current!
    const panel = panelRef.current!
    const source = origin.current.source
    document.documentElement.classList.add('is-locked')

    veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? 200 : 320, easing: 'ease-out', fill: 'backwards' })
    if (source && !reduce) {
      const from = source.getBoundingClientRect()
      const to = img.getBoundingClientRect()
      source.style.visibility = 'hidden'
      img.animate([{ transform: flipFrom(from, to) }, { transform: 'none' }], { duration: 680, easing: OPEN_EASE, fill: 'backwards' })
    } else {
      img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out', fill: 'backwards' })
    }
    Array.from(panel.querySelectorAll('[data-stagger]')).forEach((el, i) => {
      el.animate(
        reduce
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: 'translateY(14px)' },
              { opacity: 1, transform: 'none' },
            ],
        { duration: 560, delay: 180 + i * 50, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
      )
    })
    closeRef.current?.focus({ preventScroll: true })

    return () => {
      document.documentElement.classList.remove('is-locked')
      if (source) source.style.visibility = ''
    }
    // Runs once per opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close: return to the piece it came from when we are still on that view; otherwise fade.
  useEffect(() => {
    if (!closing) return
    const img = imgRef.current!
    const veil = veilRef.current!
    const panel = panelRef.current!
    const { look: oLook, view: oView, source } = origin.current
    const returning = source && !reduce && oLook === state.look && oView === state.view && source.isConnected

    panel.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'forwards' })
    let done: Promise<unknown>
    if (returning) {
      const to = source.getBoundingClientRect()
      const from = img.getBoundingClientRect()
      done = img.animate([{ transform: 'none' }, { transform: flipFrom(to, from) }], { duration: 460, easing: CLOSE_EASE, fill: 'forwards' }).finished
      veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 140, easing: 'ease-out', fill: 'forwards' })
    } else {
      img.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' })
      done = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, delay: 60, easing: 'ease-out', fill: 'forwards' }).finished
    }
    done.then(onClosed)
  }, [closing, onClosed, reduce, state.look, state.view])

  // Changing look or view: a short blurred crossfade so the two photographs read as one change.
  const go = useCallback(
    (lookIndex: number, viewIndex: number) => {
      if (closing) return
      if (reduce) {
        onNavigate(lookIndex, viewIndex)
        return
      }
      setSwapping(true)
      window.setTimeout(() => {
        onNavigate(lookIndex, viewIndex)
        setFresh(true)
        setSwapping(false)
      }, 140)
    },
    [closing, onNavigate, reduce],
  )

  const prev = (state.look - 1 + LOOKS.length) % LOOKS.length
  const next = (state.look + 1) % LOOKS.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onRequestClose()
      } else if (e.key === 'ArrowRight') go(next, 0)
      else if (e.key === 'ArrowLeft') go(prev, 0)
      else if (e.key === 'Tab') {
        const focusables = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, next, prev, onRequestClose])

  return (
    <div ref={rootRef} className="viewer" role="dialog" aria-modal="true" aria-labelledby="viewer-title">
      <div ref={veilRef} className="viewer__veil" />
      <div className="viewer__body">
        <div className="viewer__stage">
          <img
            ref={imgRef}
            key={`${state.look}-${view.file}`}
            className="viewer__img"
            data-swapping={swapping || undefined}
            data-fresh={fresh || undefined}
            src={src(view.file, 1200)}
            srcSet={srcSet(view.file)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            width={view.w}
            height={view.h}
            alt={view.alt}
            style={{ backgroundColor: view.bg }}
          />
        </div>

        <div ref={panelRef} className="viewer__panel">
          <div className="viewer__top" data-stagger>
            <span className="annot-text">
              Look {look.no} <span className="viewer__count">/ {String(LOOKS.length).padStart(2, '0')}</span>
            </span>
            <button ref={closeRef} type="button" className="viewer__close" onClick={onRequestClose}>
              Close <Close />
            </button>
          </div>

          <div className="viewer__info" data-swapping={swapping || undefined}>
            <h2 id="viewer-title" className="viewer__title" data-stagger>
              {look.name}
            </h2>
            <p className="viewer__notes" data-stagger>
              {look.notes}
            </p>
            <p className="viewer__details annot-text" data-stagger>
              {look.details.join(' · ')}
            </p>

            {look.views.length > 1 && (
              <div className="viewer__views" role="group" aria-label="Views" data-stagger>
                {look.views.map((v, i) => (
                  <button
                    key={v.file}
                    type="button"
                    className="viewer__thumb"
                    aria-pressed={i === state.view}
                    aria-label={`${v.label} view`}
                    onClick={() => i !== state.view && go(state.look, i)}
                  >
                    <img src={src(v.file, 640)} alt="" width={v.w} height={v.h} />
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="viewer__cta" data-stagger>
              <a className="button" href={whatsappLink(enquiryFor(look))} target="_blank" rel="noreferrer">
                Enquire about Look {look.no} <ArrowRight />
              </a>
              <p className="viewer__fine">Made to order and fitted to you. We reply on WhatsApp.</p>
            </div>
          </div>

          <nav className="viewer__nav" aria-label="Other looks" data-stagger>
            <button type="button" className="link-button" onClick={() => go(prev, 0)}>
              <ArrowLeft /> Look {LOOKS[prev].no}
            </button>
            <button type="button" className="link-button" onClick={() => go(next, 0)}>
              Look {LOOKS[next].no} <ArrowRight />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
