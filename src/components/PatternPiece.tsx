import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export type Notch = { side: 'top' | 'right' | 'bottom' | 'left'; at: number; double?: boolean }

type Props = {
  children: ReactNode
  /** When true, the cutting line draws itself around the piece and the image is revealed. */
  drawn: boolean
  notches?: Notch[]
  /** Distance from the image edge to the dashed cutting line, in px. */
  allowance?: number
  delay?: number
  className?: string
}

const PAD = 24

/**
 * A photograph treated as a pattern piece: the image is the piece, a dashed
 * cutting line runs a seam allowance outside it, and notches mark where it
 * joins its neighbours.
 */
export function PatternPiece({ children, drawn, notches = [], allowance = 10, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const maskId = `seam-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const a = allowance
  const seam = size && { x: PAD - a, y: PAD - a, w: size.w + a * 2, h: size.h + a * 2 }
  const perimeter = seam ? 2 * (seam.w + seam.h) : 0

  const notchLines = (n: Notch) => {
    if (!size || !seam) return []
    const offsets = n.double ? [-3, 3] : [0]
    return offsets.map((o) => {
      if (n.side === 'top' || n.side === 'bottom') {
        const x = PAD + size.w * n.at + o
        const y1 = n.side === 'top' ? seam.y : seam.y + seam.h
        const y2 = n.side === 'top' ? PAD : PAD + size.h
        return { x1: x, x2: x, y1, y2 }
      }
      const y = PAD + size.h * n.at + o
      const x1 = n.side === 'left' ? seam.x : seam.x + seam.w
      const x2 = n.side === 'left' ? PAD : PAD + size.w
      return { x1, x2, y1: y, y2: y }
    })
  }

  return (
    <div
      ref={ref}
      className={['piece', className].filter(Boolean).join(' ')}
      data-drawn={drawn || undefined}
      style={{ ['--piece-delay' as string]: `${delay}ms` }}
    >
      <div className="piece__cut">{children}</div>
      {size && seam && (
        <svg
          className="piece__marks"
          width={size.w + PAD * 2}
          height={size.h + PAD * 2}
          style={{ left: -PAD, top: -PAD }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <rect
                className="piece__draw"
                x={seam.x}
                y={seam.y}
                width={seam.w}
                height={seam.h}
                fill="none"
                stroke="#fff"
                strokeWidth={6}
                strokeDasharray={perimeter}
                strokeDashoffset={drawn ? 0 : perimeter}
              />
            </mask>
          </defs>
          <rect className="piece__seam" x={seam.x} y={seam.y} width={seam.w} height={seam.h} mask={`url(#${maskId})`} />
          <g className="piece__notches">
            {notches.flatMap(notchLines).map((l, i) => (
              <line key={i} {...l} />
            ))}
          </g>
        </svg>
      )}
    </div>
  )
}
