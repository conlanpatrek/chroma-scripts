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

type VoidKeys<T extends {}> = { [K in keyof T]: T[K] extends void ? K : never}[keyof T]
type NonVoidKeys<T extends {}> = { [K in keyof T]: T[K] extends void ? never : K}[keyof T]

export class ComplexEmitter<T extends {} = {[key: string]: unknown}>
{
    listeners: Map<keyof T, unknown> = new Map()

    getEmitter<K extends keyof T> (key: K): Emitter<T[K]> | undefined
    {
        return this.listeners.get(key) as Emitter<T[K]> | undefined
    }

    addListener<K extends keyof T>(key: K, handler: Handler<T[K]>)
    {
        let emitter = this.getEmitter(key)

        if (emitter === undefined) {
            emitter = new SimpleEmitter<T[K]>()
            this.listeners.set(key, emitter)
        }

        emitter.addListener(handler)
    }

    removeListener<K extends keyof T>(key: K, handler: Handler<T[K]>)
    {
        const emitter = this.getEmitter(key)
        if (emitter === undefined) return

        emitter.removeListener(handler)
        if (emitter.size === 0) this.listeners.delete(key)
    }
    
    emit<K extends VoidKeys<T>>(key: K): void
    emit<K extends NonVoidKeys<T>>(key: K, message: T[K]): void
    emit<K extends keyof T>(key: K, message?: T[K]): void
    {
        const emitter = this.getEmitter(key)
        if (emitter === undefined) return

        emitter.emit(message!)
    }
}
