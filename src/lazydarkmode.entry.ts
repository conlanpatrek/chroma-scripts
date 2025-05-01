import { LazyDarkMode, forceExplicitBackground, setEnabled } from 'chroma/LazyDarkMode'

import { ChildController } from './Controller/ChildController'
import { Menu } from 'chroma/Menu'
import { TopController } from './Controller/TopController'
import { bind } from 'chroma/KeyBindings'
import { isTop } from './util/isChild'

const ldm = new LazyDarkMode()
const menu = new Menu(ldm)

// TODO: Load and default runtime options.

// Make sure the index / html has an explicit background.
forceExplicitBackground()
const top = isTop()

async function run()
{
    if (top) return registerAsTop()
    
    try {
        return await registerAsChild()
    } catch (e) {
        // Suppress, fallthrough
    }

    registerAsTop()
}

run()

function registerAsTop()
{
    const controller = new TopController()

    controller.addListener('childAdded', child => controller.send('darkmode', ldm.enabled, child))
    controller.addListener('key', key =>
    {
        if (key === '∂') return ldm.toggle()
        if (key === 'Î') return menu.toggle()
    })

    // When darkmode changes, enable / disable background setting.
    ldm.addListener(setEnabled)
    ldm.addListener(enabled => controller.broadcast('darkmode', enabled))

    // Wire keybindings.
    bind('∂', () => ldm.toggle())
    bind('Î', () => menu.toggle())
}

async function registerAsChild()
{
    const controller = new ChildController()

    // When darkmode changes in parent, enable / disable background setting.
    ldm.addListener(setEnabled)
    controller.addListener('darkmode', (enabled) =>
    {
        if (enabled) ldm.enable(true)
        else ldm.disable(true)
    })
    
    // Wire keybindings
    bind('∂', () => controller.broadcast('key', '∂'))
    bind('Î', () => controller.broadcast('key', 'Î'))

}

