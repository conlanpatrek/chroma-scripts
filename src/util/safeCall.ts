/**
 * Call a function without risk of throwing. Write errors to console.
 */
export function safeCall<T extends (...args: unknown[]) => void>(func: T, ...args: Parameters<T>): void
{
    try {
        func(...args)
    } catch (error) {
        console.error(error)
    }
}
