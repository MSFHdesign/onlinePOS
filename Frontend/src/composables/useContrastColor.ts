/**
 * Composable for determining the appropriate contrast color (black or white) based on a background color
 */
export function useContrastColor() {
  /**
   * Calculates whether black or white text will have better contrast on a given background color
   * @param hexColor - Hex color code (with or without #)
   * @returns '#000000' for black text or '#FFFFFF' for white text
   */
  const getContrastColor = (hexColor: string | null): string => {
    if (!hexColor) return '#000000'
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  return {
    getContrastColor
  }
} 