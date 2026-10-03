import { useId, useRef, useState, type FormEvent } from 'react'
import { LOOKS } from '../data/looks'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, whatsappLink } from '../lib/contact'
import { ArrowRight } from '../components/Icons'

const OCCASIONS = ['Evening event', 'Wedding', 'Engagement', 'Gala', 'Something else']

function formatDate(value: string) {
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function Consultation() {
  const id = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState(OCCASIONS[0])
  const [date, setDate] = useState('')
  const [look, setLook] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Add your name so we know who we are speaking with.')
      nameRef.current?.focus()
      return
    }
    setError('')
    const chosen = LOOKS.find((l) => l.id === look)
    const parts = [
      `Hello Glamlove, my name is ${name.trim()}.`,
      `I would like to book a consultation for ${occasion === 'Something else' ? 'an occasion' : `a ${occasion.toLowerCase()}`}${date ? ` on ${formatDate(date)}` : ''}.`,
      chosen ? `I love Look ${chosen.no}, the ${chosen.name.toLowerCase()}.` : '',
      note.trim(),
    ].filter(Boolean)
    window.open(whatsappLink(parts.join(' ')), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="consult" id="consultation" aria-labelledby="consult-title">
      <div className="consult__intro">
        <h2 id="consult-title" className="section-title">
          Begin with a conversation
        </h2>
        <p className="section-lede">
          Tell us a little about your occasion. Your note opens in WhatsApp, ready to send, and we arrange your consultation
          from there.
        </p>
        <p className="consult__alt">
          Prefer Instagram?{' '}
          <a className="link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            Message @{INSTAGRAM_HANDLE}
          </a>
        </p>
      </div>

      <form className="envelope" onSubmit={submit} noValidate>
        <div className="envelope__row">
          <label htmlFor={`${id}-name`}>Your name</label>
          <input
            ref={nameRef}
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            required
          />
          {error && (
            <p id={`${id}-error`} className="envelope__error" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="envelope__row">
          <label htmlFor={`${id}-occasion`}>Occasion</label>
          <select id={`${id}-occasion`} value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            {OCCASIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="envelope__row">
          <label htmlFor={`${id}-date`}>
            Date <span className="envelope__optional">optional</span>
          </label>
          <input id={`${id}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="envelope__row">
          <label htmlFor={`${id}-look`}>
            A look you love <span className="envelope__optional">optional</span>
          </label>
          <select id={`${id}-look`} value={look} onChange={(e) => setLook(e.target.value)}>
            <option value="">None yet</option>
            {LOOKS.map((l) => (
              <option key={l.id} value={l.id}>
                Look {l.no} — {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className="envelope__row envelope__row--tall">
          <label htmlFor={`${id}-note`}>
            Anything else <span className="envelope__optional">optional</span>
          </label>
          <textarea id={`${id}-note`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="envelope__submit">
          <button type="submit" className="button">
            Continue on WhatsApp <ArrowRight />
          </button>
        </div>
      </form>
    </section>
  )
}
