function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

function getLuminance(hexColor: string): number {
  const { r, g, b } = hexToRgb(hexColor)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/**
 * cálculo de contraste, usando a fórmula: (L1 + 0.05) / (L2 + 0.05)
 * L1 e L2 são as luminâncias
 * */
function getContrastRatio(fg: string, bg: string): number {
  const fgLum = getLuminance(fg)
  const bgLum = getLuminance(bg)
  return (fgLum + 0.05) / (bgLum + 0.05)
}

export function getContrastSafeColor(hexColor: string | null): string {
  const root = document.documentElement
  const bgThemeColor = getComputedStyle(root).getPropertyValue('--color-darkBG').trim()
  const mainThemeColor = getComputedStyle(root).getPropertyValue('--color-main').trim()

  if (!hexColor || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hexColor)) {
    return mainThemeColor
  }

  const ratio = getContrastRatio(hexColor, bgThemeColor)
  const minContrastRatio = 3

  return ratio >= minContrastRatio ? hexColor : mainThemeColor
}
