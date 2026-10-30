const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

/** WCAG 2.x minimum contrast for large text and UI components. */
const MIN_CONTRAST_RATIO = 3

function hexToRgb(hex: string) {
  let value = hex.replace(/^#/, '')
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const int = parseInt(value, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

/** Relative luminance as defined by WCAG: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(a: string, b: string): number {
  const la = getRelativeLuminance(a)
  const lb = getRelativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

let themeColors: { background: string; fallback: string } | null = null

function getThemeColors() {
  if (!themeColors) {
    const style = getComputedStyle(document.documentElement)
    themeColors = {
      background: style.getPropertyValue('--color-darkBG').trim(),
      fallback: style.getPropertyValue('--color-main').trim(),
    }
  }
  return themeColors
}

/**
 * AniList cover colors are used as accent text over the dark background. Returns the
 * color itself when it is readable there, otherwise the theme's main color.
 */
export function getContrastSafeColor(hexColor: string | null): string {
  const { background, fallback } = getThemeColors()

  if (!hexColor || !HEX_COLOR.test(hexColor)) {
    return fallback
  }

  return getContrastRatio(hexColor, background) >= MIN_CONTRAST_RATIO ? hexColor : fallback
}
