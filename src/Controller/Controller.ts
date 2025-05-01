import { ChromaMessage, chroma } from './common'

import { ComplexEmitter } from 'chroma/util/Emitter'

export class Controller<T extends {} = {[key: string]: unknown}> extends ComplexEmitter<T>
{
    children: Set<MessageEventSource> = new Set()

    constructor()
    {
        super()
        window.addEventListener('message', event =>
        {
            const chroma = event.data.chroma
            if (chroma !== chroma) return
            const type: string = event.data.type
            if (!type) return
    
            const methodName = `handle${type[0]?.toUpperCase() + type.substring(1)}`
            if (typeof (this as any)[methodName] === 'function') (this as any)[methodName](event.data.payload, event)
        })
    }

    createMessage<T>(type: string, payload: T): ChromaMessage<T>
    {
        return { chroma, type, payload }
    }

    broadcast<T>(type: string, payload: T)
    {
        const message = this.createMessage(type, payload)

        for (const window of this.children) {
            window.postMessage(message)
        }
    }

    send<T>(type: string, payload: T, receiver: MessageEventSource)
    {
        const message = this.createMessage(type, payload)
        receiver.postMessage(message)
    }
}