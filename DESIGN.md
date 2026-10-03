# Design

The world: **atelier pattern paper**. The page is a sheet of pattern paper, the
photographs are the pattern pieces, and every mark a pattern maker would draw
(cutting lines, notches, grainlines, labels) is drawn in one tailor's-pencil blue.
Black ink and white paper do everything else. There are no gradients, glass,
shadows or rounded cards.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#ffffff` | Ground. It carries the dot-and-cross marks (`--paper-marks`), a cross every 56px, at 20% pencil. |
| `--ink` | `#121212` | Type, primary buttons, the logo. |
| `--ink-2` | `#4f4f4f` | Body copy and secondary text (8.2:1 on white). |
| `--rule` | `#e4e4e4` | Hairlines between rows and sections. |
| `--pencil` | `#2b3a9a` | Pattern marks, annotation labels, focus rings, selection, button hover. |
| `--pencil-soft` | `#a9b1dc` | Selvedge rules. |
| `--error` | `#a3241e` | Form errors only. |

## Type

- **Display:** Bodoni Moda (variable, optical size). Weight 400, tight leading
  (0.94–1.05) and slightly negative tracking. It's a near match for the traced
  wordmark.
- **Text:** Geist, at 16–17px with 1.55 leading.
- **Annotation:** Geist Mono, 11.5px uppercase with +0.08em tracking, always in
  pencil blue. It's used only for things a pattern maker would label: look numbers,
  piece names, stages and form field names.

## Shape and line

- Square corners everywhere.
- Cutting line: 1px pencil, dashed 5/4, set 8–10px outside the image edge.
- Notches: short 1.25px pencil ticks across the cutting line. A double notch is two
  ticks 6px apart.
- Hairlines: 1px `--rule`. The form and footer open with a 1px ink rule.

## Motion

| Moment | Treatment |
| --- | --- |
| Intro (once per session) | Butterfly flight along a smooth path through the canvas, with flapping wings that hinge in 3D (2.9s). The wordmark rises letter by letter with a 55ms stagger and `cubic-bezier(.16,1,.3,1)`. The butterfly lands and settles with two slow wingbeats, then the lockup moves into the header logo (1.05s, `cubic-bezier(.77,0,.175,1)`). Skippable. |
| Pattern pieces | When a piece scrolls into view, the image is revealed top-down with `clip-path` (1.25s ease-in-out) and settles from 1.08 to 1 scale. The cutting line then draws around it and the notches fade in. |
| Atelier | The bodice pattern draws as you scroll: measurement guides, then the outline, the cutting line with notches, and finally the grainline, labels and butterfly stamp. |
| Look viewer | The photo grows out of the tapped piece (680ms, `cubic-bezier(.32,.72,0,1)`) and returns to it on close (460ms). Switching looks uses a 140ms blurred crossfade. |
| Controls | Press scales to 0.97 over 160ms. Hover effects only apply on devices that support hover. |

With reduced motion, the intro is a fade, the drawing appears complete, and nothing
moves by transform.

## Layout

- 12 columns, with a gutter of `clamp(16px, 4vw, 56px)` and a maximum width of 1560px.
- The collection is laid out like a marker: pieces of varied width and offset, as
  they would sit on a cutting table. On phones it becomes two staggered columns.
- Selvedge rules (a double hairline) open and close the collection.
