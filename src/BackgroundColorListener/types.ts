export type ParsedColor = [r: number, g: number, b: number, a: number]
export type Color = `rgb(${number}, ${number}, ${number})`
export type ColorHandler = (arg: Color) => void
