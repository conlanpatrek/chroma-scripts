import { Controller } from './Controller'

export class TopController extends Controller<{
    childAdded: MessageEventSource,
    childRemoved: MessageEventSource,
    key: string
}>
{
    handleChildAdded(_: void, event: MessageEvent)
    {
        if (!event.source) return
        this.children.add(event.source)
        this.emit('childAdded', event.source)
    }

    handleChildRemoved(_: void, event: MessageEvent)
    {
        if (!event.source) return
        this.children.delete(event.source)
        this.emit('childRemoved', event.source)
    }

    handleKey(key: string)
    {
        this.emit('key', key)
    }
}
