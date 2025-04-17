import { KeyBindings } from './KeyBindings'

const bindings = new KeyBindings()

export const bind = bindings.addListener.bind(bindings) as typeof bindings.addListener
export const unbind = bindings.removeListener.bind(bindings) as typeof bindings.removeListener