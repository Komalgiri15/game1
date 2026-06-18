/** Reusable cumulus cloud silhouettes — proper bezier shapes */

/** Small distant puff */
export const CLOUD_PUFF_SM =
  'M0 28 C0 8 22 0 42 10 C58 -6 92 -4 104 18 C128 14 148 32 148 48 H0 Z'

/** Medium cloud bank */
export const CLOUD_BANK_MD =
  'M0 52 C0 18 38 4 72 16 C96 -8 148 -6 168 28 C210 20 252 48 252 78 H0 Z'

/** Large mid-layer cloud */
export const CLOUD_BANK_LG =
  'M0 68 C0 22 52 6 98 22 C132 -10 198 -8 228 36 C288 26 348 58 348 98 H0 Z'

/** Foreground heavy cloud */
export const CLOUD_BANK_XL =
  'M0 88 C0 28 68 8 128 28 C172 -12 268 -8 308 48 C388 38 468 78 468 118 H0 Z'

/** Wispy high cirrus-style */
export const CLOUD_WISPY =
  'M0 20 C20 4 60 2 88 14 C110 6 140 10 156 24 C170 18 188 28 188 36 H0 Z'

export interface PlacedCloud {
  x: number
  y: number
  scale: number
  path: string
  flip?: boolean
}

export const DISTANT_CLOUDS: PlacedCloud[] = [
  { x: 60, y: 140, scale: 1.1, path: CLOUD_PUFF_SM },
  { x: 280, y: 120, scale: 1.25, path: CLOUD_PUFF_SM, flip: true },
  { x: 520, y: 155, scale: 1, path: CLOUD_PUFF_SM },
  { x: 780, y: 110, scale: 1.35, path: CLOUD_PUFF_SM, flip: true },
  { x: 1040, y: 145, scale: 1.15, path: CLOUD_PUFF_SM },
  { x: 1320, y: 125, scale: 1.2, path: CLOUD_PUFF_SM, flip: true },
  { x: 1580, y: 150, scale: 1.05, path: CLOUD_PUFF_SM },
  { x: 1820, y: 130, scale: 1.2, path: CLOUD_PUFF_SM },
  { x: 2060, y: 140, scale: 1.1, path: CLOUD_PUFF_SM, flip: true },
]

export const MID_CLOUDS: PlacedCloud[] = [
  { x: 80, y: 380, scale: 2.2, path: CLOUD_BANK_LG },
  { x: 720, y: 420, scale: 2.4, path: CLOUD_BANK_LG, flip: true },
  { x: 1380, y: 390, scale: 2.1, path: CLOUD_BANK_LG },
  { x: 1980, y: 400, scale: 2.2, path: CLOUD_BANK_LG, flip: true },
]

export const FORE_CLOUDS: PlacedCloud[] = [
  { x: -60, y: 680, scale: 2.6, path: CLOUD_BANK_XL },
  { x: 780, y: 720, scale: 2.8, path: CLOUD_BANK_XL, flip: true },
  { x: 1620, y: 690, scale: 2.5, path: CLOUD_BANK_XL },
  { x: 2280, y: 710, scale: 2.6, path: CLOUD_BANK_XL, flip: true },
]

export const WISPY_CLOUDS: PlacedCloud[] = [
  { x: 200, y: 260, scale: 2, path: CLOUD_WISPY },
  { x: 600, y: 240, scale: 1.8, path: CLOUD_WISPY, flip: true },
  { x: 1100, y: 270, scale: 2.1, path: CLOUD_WISPY },
  { x: 1500, y: 250, scale: 1.9, path: CLOUD_WISPY, flip: true },
]
