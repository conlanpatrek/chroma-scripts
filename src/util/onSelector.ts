import { safeCall } from './safeCall'

export function onSelector<T extends Element>(selector: string, cb: (element: T) => void)
{
    const loop = () =>
    {
        const result = document.querySelector<T>(selector)
        if (result) safeCall(cb, result)
        requestAnimationFrame(loop)
    }

    loop()
}
