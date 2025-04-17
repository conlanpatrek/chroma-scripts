/**
 * Linear interpolate between two values, a and b.
 *
 * @param a 
 * @param b 
 * @param t Value between 0 and 1
 *
 * @returns The interpolated value
 */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
