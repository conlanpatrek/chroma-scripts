import { Color, ColorHandler } from './types'

import { SimpleEmitter } from 'chroma/util/Emitter'
import { getBackgroundColor } from './getBackgroundColor'
import { safeCall } from 'chroma/util/safeCall'

const POLL_INTERVAL = 0

export class BackgroundColorListener extends SimpleEmitter<Color>
{
    private timeout: number | undefined = undefined
    currentColor: Color

    private get listening(): boolean
    { return this.timeout !== undefined }

    constructor()
    {
        super()
        this.currentColor = getBackgroundColor()
    }

    /**
     * Start the poll timeout. If it's already running, do nothing.
     */
    private listen()
    {
        if (this.listening) return
        // @ts-ignore
        if (POLL_INTERVAL === 0) this.tick()
        else this.timeout = setInterval(this.tick, POLL_INTERVAL)
    }

    /**
     * Clear the poll timeout. If it's not running, do nothing.
     */
    private stopListening()
    {
        if (!this.listening) return
        // @ts-ignore
        if (POLL_INTERVAL === 0) cancelAnimationFrame(this.timeout)
        else clearInterval(this.timeout)
        this.timeout = undefined
    }

    /**
     * The poll handler. Gets the current background color, checks if it's changed,
     * and if so, notifies handlers.
     */
    private tick = () =>
    {
        // @ts-ignore
        if (POLL_INTERVAL === 0) this.timeout = requestAnimationFrame(this.tick)
        
        const color = getBackgroundColor()
        if (color === this.currentColor) return
        
        this.currentColor = color
        this.emit(this.currentColor)
    }

    /**
     * Register a new handler.
     */
    addListener(handler: ColorHandler)
    {
        if (this.has(handler)) return

        super.addListener(handler)
        this.listen()

        // immediately call
        safeCall(handler, this.currentColor)
    }

    /**
     * Unregister a handler.
     */
    removeListener(handler: ColorHandler)
    {
        super.removeListener(handler)
        if (this.size === 0) this.stopListening()
    }
}