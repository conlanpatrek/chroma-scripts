import { safeCall } from './safeCall'

export type Handler<T = void> = (arg: T) => void

export interface Emitter<T = void>
{
    get size(): number
    addListener(handler: Handler<T>):void
    removeListener(handler: Handler<T>):void
    has(handler: Handler<T>): boolean
    emit(message: T): void
}

export class SimpleEmitter<T = void> implements Emitter<T>
{
    listeners: Set<Handler<T>> = new Set()

    get size(): number
    {
        return this.listeners.size
    }

    addListener(handler: Handler<T>)
    {
        this.listeners.add(handler)
    }

    removeListener(handler: Handler<T>)
    {
        this.listeners.delete(handler)
    }

    has(handler: Handler<T>)
    {
        return this.listeners.has(handler)
    }
    
    emit(message: T)
    {
        for (const handler of this.listeners) {
            safeCall(handler, message)
        }
    }
}

export class ComplexEmitter<K = string, T = void>
{
    listeners: Map<K, Emitter<T>> = new Map()

    addListener(key: K, handler: Handler<T>)
    {
        let emitter = this.listeners.get(key)!

        if (emitter === undefined) {
            emitter = new SimpleEmitter()
            this.listeners.set(key, emitter)
        }

        emitter.addListener(handler)
    }

    removeListener(key: K, handler: Handler<T>)
    {
        const emitter = this.listeners.get(key)!
        if (emitter === undefined) return

        emitter.removeListener(handler)
        if (emitter.size === 0) this.listeners.delete(key)
    }
    
    emit(key: K, message: T)
    {
        const emitter = this.listeners.get(key)!
        if (emitter === undefined) return

        emitter.emit(message)
    }
}
