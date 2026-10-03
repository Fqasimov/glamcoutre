import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { LookViewer, type ViewerState } from './components/LookViewer'
import { HERO_IMAGE, LOOKS, srcSet } from './data/looks'
import { Atelier } from './sections/Atelier'
import { Collection } from './sections/Collection'
import { Consultation } from './sections/Consultation'
import { Detail } from './sections/Detail'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'

export type OpenLook = (look: number, view: number, source: HTMLElement | null) => void

const INTRO_KEY = 'glamlove:intro-seen'

function introSeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

// History updates can be refused inside sandboxed frames; the viewer works without them.
function safeHistory(fn: () => void) {
  try {
    fn()
  } catch {
    // Ignore: the look stays open, only the address bar does not change.
  }
}

function lookFromHash() {
  const index = LOOKS.findIndex((l) => `#${l.id}` === window.location.hash)
  return index >= 0 ? index : null
}

export default function App() {
  const [intro, setIntro] = useState(() => !introSeen())
  const [ready, setReady] = useState(() => !intro)
  const headerLockup = useRef<HTMLSpanElement>(null)

  const heroReady = useMemo(() => {
    const img = new Image()
    img.sizes = '(min-width: 1024px) 40vw, 92vw'
    img.srcset = srcSet(LOOKS[0].views[0].file)
    img.src = HERO_IMAGE
    return img.decode().catch(() => undefined)
  }, [])

  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const [closing, setClosing] = useState(false)
  const viewerOpen = useRef(false)
  const pushedEntry = useRef(false)

  const open = useCallback<OpenLook>((look, view, source) => {
    setClosing(false)
    setViewer({ look, view, source })
    viewerOpen.current = true
    if (source) {
      safeHistory(() => {
        window.history.pushState({ look: LOOKS[look].id }, '', `#${LOOKS[look].id}`)
        pushedEntry.current = true
      })
    }
  }, [])

  const navigate = useCallback((look: number, view: number) => {
    setViewer((v) => (v ? { ...v, look, view } : v))
    safeHistory(() => window.history.replaceState(window.history.state, '', `#${LOOKS[look].id}`))
  }, [])

  const requestClose = useCallback(() => setClosing(true), [])

  const closed = useCallback(() => {
    viewerOpen.current = false
    setViewer(null)
    setClosing(false)
    if (pushedEntry.current) {
      pushedEntry.current = false
      window.history.back()
    } else {
      safeHistory(() => window.history.replaceState(null, '', window.location.pathname + window.location.search))
    }
  }, [])

  // The browser's back button closes the viewer instead of leaving the page.
  useEffect(() => {
    const onPop = () => {
      if (viewerOpen.current) {
        pushedEntry.current = false
        setClosing(true)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // A shared link to a look opens it once the page is in.
  useEffect(() => {
    if (!ready) return
    const index = lookFromHash()
    if (index !== null && !viewerOpen.current) open(index, 0, null)
  }, [ready, open])

  const reveal = useCallback(() => setReady(true), [])
  const done = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // Private mode: the intro simply plays again next time.
    }
    setIntro(false)
  }, [])

  return (
    <div className="site" data-ready={ready || undefined}>
      {intro && <Loader getTarget={() => headerLockup.current} heroReady={heroReady} onReveal={reveal} onDone={done} />}
      <a className="skip-link" href="#collection">
        Skip to the collection
      </a>
      <Header lockupRef={headerLockup} logoVisible={!intro} />
      <main>
        <Hero ready={ready} onOpen={open} />
        <Collection onOpen={open} />
        <Detail />
        <Atelier />
        <Consultation />
      </main>
      <Footer />
      {viewer && (
        <LookViewer state={viewer} onNavigate={navigate} closing={closing} onRequestClose={requestClose} onClosed={closed} />
      )}
    </div>
  )
}
