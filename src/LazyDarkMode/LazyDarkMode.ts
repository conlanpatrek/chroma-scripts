import { SimpleEmitter } from 'chroma/util/Emitter'

const DARK_MODE = 'chroma_dark_mode'
const ON = 'enabled'
const OFF = 'disabled'

const html = document.documentElement

interface LazyDarkModeConfig
{
    // Whether lazy dark mode is enabled
    enabled: boolean,

    // Whether or not we should ignore media (img, video, iframes)
    ignoreMedia: boolean,

    // Default dark mode for new pages
    defaultValue: typeof OFF | typeof ON,
}

const defaultConfig: LazyDarkModeConfig = {
    enabled: false,

    ignoreMedia: true,

    defaultValue: OFF
}

/**
 * This class manages the local state for LDM
 */
export class LazyDarkMode extends SimpleEmitter<boolean>
{
    config: LazyDarkModeConfig

    constructor(config?: Partial<LazyDarkModeConfig>)
    {
        super()
        this.config = { ...defaultConfig, ...config }

        if (this.config.ignoreMedia) this.setIgnoreMedia(true)

        // Lookup the current LDM state.
        this.config.enabled = (localStorage.getItem(DARK_MODE) ?? this.config.defaultValue) === ON

        // Sync with the doc.
        if (this.config.enabled) this.enable(true)
    }

    /**
     * Flip the LDM state
     */
    toggle ()
    {
        if (this.config.enabled) this.disable()
        else this.enable()
    }

    /**
     * Remove any document level filtering.
     * 
     * Also updates local storage.
     */
    disable ()
    {
        this.config.enabled = false
        localStorage.setItem(DARK_MODE, OFF)
        html.removeAttribute('data-ldm')
        this.emit(this.config.enabled)
        // earliestStyle.innerHTML = ''
    }

    /**
     * Turn on document filtering.
     * 
     * Also updates local storage.
     */
    enable (skipUpdate: boolean = false)
    {
        this.config.enabled = true
        if (!skipUpdate) localStorage.setItem(DARK_MODE, ON)
        html.setAttribute('data-ldm', this.dataAttr)
        this.emit(this.config.enabled)
        // updateHTMLBackground()
    }

    get dataAttr ()
    {
        const suffix = this.config.ignoreMedia ? '-no-media' : ''
        return `invert${suffix}`
    }

    /**
     * Change the ignoreMedia value, and live update the doc if necessary.
     */
    setIgnoreMedia (value: boolean)
    {
        this.config.ignoreMedia = value
        if (this.config.enabled) this.enable()
    }
}