import { forceExplicitBackground, setEnabled } from './forceExplicitBackground'

import { LazyDarkMode } from './LazyDarkMode'
import { Menu } from 'chroma/Menu'
import { bind } from 'chroma/KeyBindings'

const ldm = new LazyDarkMode()
const menu = new Menu(ldm)

// TODO: Load and default runtime options.

// Make sure the index / html has an explicit background.
forceExplicitBackground()

// When darkmode changes, enable / disable background setting.
ldm.addListener(setEnabled)

// Wire keybindings.
bind('∂', () => ldm.toggle())
bind('Î', () => menu.toggle())
