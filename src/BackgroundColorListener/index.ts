import { BackgroundColorListener } from './BackgroundColorListener'

const bcl = new BackgroundColorListener()

export const backgroundColor = {
    get current() { return bcl.currentColor },
    addListener: bcl.addListener.bind(bcl) as typeof bcl.addListener,
    removeListener: bcl.removeListener.bind(bcl) as typeof bcl.removeListener
}
