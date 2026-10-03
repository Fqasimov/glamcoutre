export type LookView = {
  file: string
  w: number
  h: number
  bg: string
  alt: string
  label: string
}

export type Look = {
  id: string
  no: string
  name: string
  notes: string
  details: string[]
  views: LookView[]
}

const base = import.meta.env.BASE_URL

export function src(file: string, size: 640 | 1200) {
  return `${base}looks/${file}-${size}.webp`
}

export function srcSet(file: string) {
  return `${src(file, 640)} 640w, ${src(file, 1200)} 1200w`
}

export const LOOKS: Look[] = [
  {
    id: 'look-01',
    no: '01',
    name: 'Teal halter gown',
    notes:
      'A halter neck over a square neckline, with sunburst pleating that sweeps through the hip into a fishtail train. Shown with its matching sheer stole.',
    details: ['Halter', 'Mermaid', 'Train'],
    views: [
      { file: '01-teal-front', w: 1158, h: 1484, bg: '#a8a8a8', label: 'Front', alt: 'Teal halter mermaid gown with sunburst pleating, front view on a mannequin' },
      { file: '01-teal-stole', w: 1157, h: 1908, bg: '#b8b8b8', label: 'With stole', alt: 'The teal gown worn with a sheer teal stole draped from the shoulders' },
      { file: '01-teal-back', w: 1158, h: 1860, bg: '#b8b8b8', label: 'Back', alt: 'Back of the teal gown: open back, halter tie and flowing stole panels' },
    ],
  },
  {
    id: 'look-02',
    no: '02',
    name: 'Ivory draped gown',
    notes:
      'A strapless sculpted bodice with a lace-lined neckline, falling into a taffeta skirt gathered into deep, generous drapes.',
    details: ['Strapless', 'Mermaid', 'Draped'],
    views: [{ file: '02-ivory-taffeta', w: 1157, h: 1739, bg: '#989898', label: 'Front', alt: 'Ivory taffeta mermaid gown with a sculpted strapless bodice and a draped skirt' }],
  },
  {
    id: 'look-03',
    no: '03',
    name: 'Black feather-cuff gown',
    notes: 'Crystal-flecked black jersey with a deep cowl drape at the neckline and full ostrich-feather cuffs.',
    details: ['Long sleeve', 'Cowl', 'Feather'],
    views: [{ file: '03-noir-feather', w: 1057, h: 1924, bg: '#282828', label: 'Front', alt: 'Black crystal-flecked gown with a draped cowl neckline and feather cuffs, on a hanger' }],
  },
  {
    id: 'look-04',
    no: '04',
    name: 'Bordeaux crystal dress',
    notes: 'Crystal mesh over a fitted midi, gathered into ruching at the side, with strong, squared shoulders.',
    details: ['Long sleeve', 'Ruched', 'Midi'],
    views: [{ file: '04-bordeaux-crystal', w: 1041, h: 1924, bg: '#f8f8f8', label: 'Front', alt: 'Bordeaux crystal mesh long-sleeve midi dress with side ruching' }],
  },
  {
    id: 'look-05',
    no: '05',
    name: 'Red strapless dress',
    notes: 'A clean strapless bodice over a full, softly flared skirt that moves when she walks.',
    details: ['Strapless', 'A-line', 'Midi'],
    views: [{ file: '05-rouge-strapless', w: 1101, h: 1875, bg: '#980818', label: 'Worn', alt: 'Woman in a red strapless A-line midi dress at an evening event' }],
  },
  {
    id: 'look-06',
    no: '06',
    name: 'Ivory sculpted dress',
    notes: 'A high sculpted collar opening into a keyhole, cap sleeves, and a pointed basque at the waist.',
    details: ['Cap sleeve', 'Collar', 'Midi'],
    views: [{ file: '06-ivory-collar', w: 1094, h: 1829, bg: '#c8b8a8', label: 'Front', alt: 'Ivory dress with a sculpted standing collar, keyhole neckline and cap sleeves' }],
  },
  {
    id: 'look-07',
    no: '07',
    name: 'Azure zigzag knit',
    notes: 'A fine zigzag knit in turquoise, sky and lime, twisted at the halter neck and falling straight to the floor.',
    details: ['Halter', 'Knit', 'Maxi'],
    views: [{ file: '07-azure-zigzag', w: 1051, h: 1924, bg: '#f8f8f8', label: 'Worn', alt: 'Woman in a turquoise and lime zigzag knit halter maxi dress by a garden' }],
  },
  {
    id: 'look-08',
    no: '08',
    name: 'Ivory chevron knit',
    notes: 'A one-shoulder knit with a single long sleeve, its multicolour chevrons running on the bias.',
    details: ['One shoulder', 'Knit', 'Maxi'],
    views: [{ file: '08-white-zigzag', w: 947, h: 1578, bg: '#ffffff', label: 'Flat', alt: 'White one-shoulder maxi dress with diagonal multicolour zigzag stripes' }],
  },
  {
    id: 'look-09',
    no: '09',
    name: 'Pastel chevron knit',
    notes: 'A sleeveless scoop-neck column in a soft chevron lace knit of rose, mint and charcoal.',
    details: ['Sleeveless', 'Knit', 'Column'],
    views: [{ file: '09-pastel-zigzag', w: 975, h: 1625, bg: '#ffffff', label: 'Flat', alt: 'Sleeveless pastel and black chevron knit maxi dress' }],
  },
]

export function enquiryFor(look: Look) {
  return `Hello Glamlove, I would like to talk about Look ${look.no}, the ${look.name.toLowerCase()}.`
}

export const HERO_IMAGE = src(LOOKS[0].views[0].file, 1200)
