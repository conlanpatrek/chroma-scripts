type Awaitable<T> = T | Promise<T>

const promiseCache: Map<() => unknown, Promise<unknown>> = new Map()
function getCached<T>(cb: () => T|undefined): Promise<T> | undefined
{
    if (!promiseCache.has(cb)) return undefined
    return promiseCache.get(cb) as unknown as Promise<T>
}

function setCached<T>(cb: () => T | undefined, promise: Promise<T>)
{
    promiseCache.set(cb, promise)
}

/**
 * Waits for a function to resolve to a non-undefined value, and resolves a promise.
 */
export function waitFor<T>(cb: () => T | undefined): Awaitable<T>
{
    const value = cb()
    if (value !== undefined) return value

    const promise = getCached(cb)
    if (promise !== undefined) return promise

    const cached = new Promise<T>((resolve) =>
    {
        const loop = () =>
        {
            const value = cb()
            
            if (value !== undefined) {
                resolve(value)
                return
            }
            
            requestAnimationFrame(loop)
        }

        loop()
    })

    setCached(cb, cached)
    return cached
}

const body = () => document.body ?? undefined
export const waitForBody = () => waitFor(body)

const head = () => document.head ?? undefined
export const waitForHead = () => waitFor(head)
