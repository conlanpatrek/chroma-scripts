import { ComplexEmitter } from 'chroma/util/Emitter'

interface SimpleKeyEvent
{
    key: string
}

/**
 * This class listens for keypress and allows setting different behaviors
 * for different keys.
 */
export class KeyBindings extends ComplexEmitter<string, void>
{
    constructor ()
    {
        super()

        // Listen for events
        window.addEventListener('keydown', this.handleKeyPress, { capture: true, passive: true })
        window.addEventListener('message', this.handleMessage)
    }

    destructor ()
    {
        // Stop listening
        window.removeEventListener('keydown', this.handleKeyPress)
        window.removeEventListener('message', this.handleMessage)
    }

    /**
     * Respond to key presses in frames.
     */
    handleMessage = (event: MessageEvent) =>
    {
        try {
            const data = JSON.parse(event.data)
            if (data.chroma !== 'scripts') return
            if (typeof data.key !== 'string') return
            this.emit(data.key)
        } catch (e) {
            // do nothing
        }
    }

    /**
     * Respond to key presses by emitting.
     */
    handleKeyPress = (event: SimpleKeyEvent) =>
    {
        this.emit(event.key)
    }
}