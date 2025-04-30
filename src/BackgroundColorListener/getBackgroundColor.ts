import { Color, ParsedColor } from './types'

import { lerp } from 'chroma/util/lerp'

/**
 * Calculate the background color of the document. Supports body AND html elements
 * because either one of those can set the viewport background.
 */
export function getBackgroundColor (): Color
{
    let color = getElementColor(document.documentElement)
    if (color[3] === 0 && document.body) color = getElementColor(document.body)
    if (color[3] === 0) return 'rgb(255, 255, 255)'

    const a = color[3]
    const r = lerp(255, color[0], a) >> 0
    const g = lerp(255, color[1], a) >> 0
    const b = lerp(255, color[2], a) >> 0

    return `rgb(${r}, ${g}, ${b})`
}

/**
 * Get the computed background color of an element. Returns transparent
 * if the element is nonexistent.
 */
function  getElementColor (maybeElement?: HTMLElement): ParsedColor
{
    if (maybeElement instanceof HTMLElement === false) return [0, 0, 0, 0]
    return parseColor(getComputedStyle(maybeElement).backgroundColor)
}

/**
 * Parse a color from an rgba() string.
 */
function  parseColor (color: string): ParsedColor
{
    const open = color.indexOf('(')
    const close = color.indexOf(')')
    const [r, g, b, a] = color.substring(open + 1, close).split(',')
    return [int(r), int(g), int(b), int(a, 1)]
}

/**
 * Convert a string to a number. If the string is malformed or if
 * it is not provided, return a fallback.
 */
function int(value?: string, fallback: number = 0): number
{
    if (value === undefined) return fallback

    const op = parseInt(value, 10)
    if (isNaN(op)) return fallback

    return op
}