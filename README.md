# Glamlove — couture atelier site

A single-page site for Glamlove, built with Vite + React. The design borrows from
pattern-making: each photograph is a pattern piece with a dashed cutting line and
notches, and annotations are set in a tailor's-pencil blue on a white,
dot-and-cross pattern-paper ground.

## Run it

```bash
npm install
npm run dev       # local development
npm run build     # production build into dist/
npm run preview   # serve the build locally
```

The build is fully static, with relative asset paths, so `dist/` can be hosted
anywhere: Netlify, Vercel, GitHub Pages or any web server.

## Before going live

- **WhatsApp number.** Set `WHATSAPP_NUMBER` in `src/lib/contact.ts`, in
  international format with digits only (for example `994501234567`). While it is
  empty, the buttons open WhatsApp's share sheet with the message pre-filled.
- **Instagram handle.** `src/lib/contact.ts` uses `glamlove_couture`, taken from the
  logo. The photo watermarks say `@glamlove.couture`, so check which one is current.
- **Copy.** The text in `src/sections/` and the look descriptions in
  `src/data/looks.ts` are drafts. In particular, check the four-stage process in
  `Atelier.tsx` against how the atelier really works.

## What's where

| Path | What it is |
| --- | --- |
| `src/components/Loader.tsx` | The intro: the butterfly flies across the canvas, the wordmark rises, the butterfly lands, and the logo moves up into the header. It plays once per browser session and can be skipped with a click, a key press or a scroll. |
| `src/brand/` | The butterfly and wordmark, traced from the logo into SVG. The wordmark is split into letters and the butterfly into two wings so they can animate. |
| `src/sections/` | The page sections: hero, collection, detail, atelier process, consultation form and footer. |
| `src/components/LookViewer.tsx` | The full-screen look view. The photo grows out of the piece you tapped, and the enquiry opens WhatsApp with the look already named. `#look-04`-style links open a look directly. |
| `src/data/looks.ts` | The nine looks: names, notes and photos. |
| `public/looks/` | The photos, cropped and exported to WebP at 640 and 1200 px wide. |

## Adding a look

1. Export the photo at 640 and 1200 px wide as `public/looks/<name>-640.webp` and
   `public/looks/<name>-1200.webp`.
2. Add an entry to `LOOKS` in `src/data/looks.ts`, with the image's pixel size so
   the layout doesn't shift while it loads.
3. Give it a grid position in `src/index.css`, in the `.look--N` rules under
   "Collection".

## Accessibility and motion

- Motion uses CSS transitions and the Web Animations API. The library `motion` is
  used only for scroll progress and in-view hooks.
- With "reduce motion" turned on, the intro becomes a short fade and the pattern
  drawing appears fully drawn.
- Dialogs trap focus and close with Esc. The browser back button closes an open look.
