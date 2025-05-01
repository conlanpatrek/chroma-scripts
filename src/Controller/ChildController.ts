import { Controller } from './Controller'
import { chroma } from './common'

export class ChildController extends Controller<{
    darkmode: boolean
}>
{
    constructor()
    {
        super()

        this.children.add(window.top!)

        window.addEventListener('pagehide', () =>
        {
            window.top?.postMessage({
                chroma,
                type: 'childRemoved'
            })
        })

        window.top?.postMessage({
            chroma,
            type: 'childAdded'
        })
    }

    handleDarkmode(enabled: boolean)
    {
        this.emit('darkmode', enabled)
    }
}
