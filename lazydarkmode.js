const SVGFilter = `
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="display:none;">
        <filter id="invert-luminance" color-interpolation-filters="sRGB">
            <!-- Approximate RGB to HSL (Extract Luminance) -->
            <feColorMatrix type="matrix" values="
                0.2126  0.7152  0.0722  0  0
                0.2126  0.7152  0.0722  0  0
                0.2126  0.7152  0.0722  0  0
                0       0       0       1  0" result="lum"/>
    
            <!-- Invert the Lightness (L -> 1 - L) -->
            <feComponentTransfer in="lum" result="mul">
                <feFuncR type="table" tableValues="1 0"/>
                <feFuncG type="table" tableValues="1 0"/>
                <feFuncB type="table" tableValues="1 0"/>
            </feComponentTransfer>
    
            <!-- Blend back with original colors using an overlay -->
            <feBlend in="mul" in2="SourceGraphic" mode="luminosity"/>
        </filter>
    </svg>
`

const filterStyle = `
    <style>
        html[data-ldm="invert"] {
            filter: invert(1);
        }

        html[data-ldm="invert-no-media"],
        html[data-ldm="invert-no-media"] img,
        html[data-ldm="invert-no-media"] video,
        html[data-ldm="invert-no-media"] [style*=background-image],
        html[data-ldm="invert-no-media"] iframe[src*="youtube.com/embed/"] {
            filter: invert(1);
        }

        html[data-ldm="luminance"] {
            filter: url(#invert-luminance);
        }

        html[data-ldm="luminance-no-media"],
        html[data-ldm="luminance-no-media"] img,
        html[data-ldm="luminance-no-media"] video,
        html[data-ldm="luminance-no-media"] [style*=background-image],
        html[data-ldm="luminance-no-media"] iframe[src*="youtube.com/embed/"] {
            filter: url(#invert-luminance);
        }
    </style>
`

const isChild = window.self !== window.top

/**
 * This class manages the local state for LDM
 */
class LazyDarkMode
{
    // The storage key we'll be looking up
    static DARK_MODE = 'chroma_dark_mode'

    // The truthy value
    static ON = 'enabled'

    // The falsey value
    static OFF = 'disabled'

    // The document element
    static html = document.documentElement

    // Whether lazy dark mode is enabled
    enabled = false

    // The inversion technique. For page load, we'll use invert() until
    // we have a document body to append an svg filter to.
    filter = 'invert'

    ignoreMedia = false

    defaultValue = LazyDarkMode.OFF

    constructor(options)
    {
        if (options.ignoreMedia) this.setIgnoreMedia(true)

        // Lookup the current LDM state.
        this.enabled = (localStorage.getItem(LazyDarkMode.DARK_MODE) ?? this.defaultValue) === LazyDarkMode.ON

        // Sync with the doc.
        if (this.enabled) this.enable(true)
    }

    /**
     * Flip the LDM state
     */
    toggle ()
    {
        if (this.enabled) this.disable()
        else this.enable()
    }

    /**
     * Remove any document level filtering.
     * 
     * Also updates local storage.
     */
    disable ()
    {
        this.enabled = false
        localStorage.setItem(LazyDarkMode.DARK_MODE, LazyDarkMode.OFF)
        LazyDarkMode.html.removeAttribute('data-ldm')
    }

    /**
     * Turn on document filtering.
     * 
     * Also updates local storage.
     */
    enable (skipUpdate)
    {
        this.enabled = true
        if (!skipUpdate) localStorage.setItem(LazyDarkMode.DARK_MODE, LazyDarkMode.ON)
        LazyDarkMode.html.setAttribute('data-ldm', this.dataAttr)
    }

    get dataAttr ()
    {
        const suffix = this.ignoreMedia ? '-no-media' : ''
        return `${this.filter}${suffix}`
    }

    /**
     * Change the filter technique, and live update the doc if necessary.
     *
     * @param {string} filter 
     */
    setFilter (filter)
    {
        this.filter = filter
        if (this.enabled) this.enable()
    }

    /**
     * Change the ignoreMedia value, and live update the doc if necessary.
     *
     * @param {bolean} value 
     */
    setIgnoreMedia (value)
    {
        this.ignoreMedia = value
        if (this.enabled) this.enable()
    }
}




let _bodyPromise = null

/**
 * Check once a frame to see if the document body has been added.
 * Only resolve once we've found it.
 * 
 * @returns Promise for the body element
 */
async function waitForBody ()
{
    if (document.body) return document.body
    if (_bodyPromise) return _bodyPromise
    _bodyPromise = new Promise((resolve) =>
    {
        const checkForBody = () =>
        {
            if (document.body) resolve(document.body)
            else requestAnimationFrame(checkForBody)
        }

        checkForBody()
    })
    return _bodyPromise
}

class Menu
{
    isOpen = false

    /** @type {HTMLDialogElement} */
    element = null

    /** @type {LazyDarkMode} */
    ldm = null

    constructor(ldm)
    {
        this.ldm = ldm
    }

    async createElement ()
    {
        this.element = await appendHTML(`
            <dialog class="∂">
                <style>
                    .∂, .∂ * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        border: none;
                        background: transparent;
                        font-size: inherit;
                    }

                    .∂ {
                        border: none;
                        transition:
                            display 0.15s allow-discrete,
                            overlay 0.15s allow-discrete,
                            opacity 0.15s ease-in-out,
                            transform 0.15s ease-in-out;
        
                        transform: translateY(10px);
                        opacity: 0;
                    }

                    .∂::backdrop {
                        transition:
                            background-color 0.15s ease-in-out,
                            backdrop-filter 0.15s ease-in-out;
                        backdrop-filter: blur(0);
                        background-color: rgba(0, 0, 0, 0);
                        opacity: 1;
                    }

                    .∂[open] {
                        opacity: 1;
                        transform: translateY(0) scale(1);

                        @starting-style {
                            transform: translateY(10px);
                            opacity: 0;
                        }
                    }

                    .∂[open]::backdrop {
                        backdrop-filter: blur(20px);
                        background-color: rgba(0, 0, 0, 0.05);

                        @starting-style {
                            backdrop-filter: blur(0);
                            background-color: rgba(0, 0, 0, 0);
                        }
                    }

                    .∂ {
                        border-radius: 4px;
                        box-shadow: 5px 10px 10px rgba(0,0,0,0.4);
                        padding: 20px;
                        background: #0a0a0a;
                        color: white;
                        margin: auto;
                        font-size: 16px;
                        border: 1px solid #333;
                    }

                    .∂-content {
                        all: unset;
                    }

                    .∂-content strong {
                        display: block;
                        margin-bottom: 1em;
                        font-size: 1.2em;
                        color: #246789;
                    }
        
                    .∂-content label {
                        display: block;
                        margin-top: 0.4em;
                    }

                    .∂-content input {
                        margin-right: 5px;
                    }

                    .∂-content button {
                        display: block;
                        width: 100%;
                        margin: 0;
                        margin-top: 1em;
                        border-radius: 4px;
                        background: #222;
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 0.8em;
                    }
                </style>

                <form method="dialog" class="∂-content">
                    <strong>Lazy Dark Mode Setting</strong>
                    <label>
                        <input type="checkbox" id="∂-ignore-media"/>
                        Preserve images and videos
                    </label>
                    <button>Close</button>
                </form>
            </dialog>
        `)

        this.element.addEventListener('click', e =>
        {
            if (!this.isOpen) return
            const rect = this.element.getBoundingClientRect()
            if (e.clientX < rect.left) return this.close()
            if (e.clientX > rect.right) return this.close()
            if (e.clientY < rect.top) return this.close()
            if (e.clientY > rect.bottom) return this.close()
        })

        const ignoreMediaInput = document.getElementById('∂-ignore-media')
        ignoreMediaInput.checked = this.ldm.ignoreMedia
        ignoreMediaInput.addEventListener('change', this.handleIgnoreMediaToggle)
    }

    toggle ()
    {
        if (this.isOpen) this.close()
        else this.open()
    }

    open ()
    {
        if (this.isOpen || !this.element) return
        this.isOpen = true
        this.element.showModal()
    }

    close ()
    {
        if (!this.isOpen || !this.element) return
        this.isOpen = false
        this.element.close()
    }

    handleIgnoreMediaToggle = event =>
    {
        const ignoreMedia = !!event.target.checked
        this.ldm.setIgnoreMedia(ignoreMedia)
        chrome.storage.sync.set({ ignoreMedia })
    }
}




/**
 * A single keypress handler.
 *
 * @typedef {(event: KeyboardEvent) => unknown} KeyBinding
 */

/**
 * This class listens for keypress and allows setting different behaviors
 * for different keys.
 */
class KeyBindings
{
    /**
     * @type {{ [key: string]: Set<KeyBinding> }}
     */
    keys = {}

    constructor ()
    {
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

    handleMessage = (event) =>
    {
        try {
            const data = JSON.parse(event.data)
            if (data.chroma !== 'scripts') return
            this.handleKeyPress(data)
        } catch (e) {
            // do nothing
        }
    }

    /**
     * The bound handler for the keypress event.
     *
     * @param {{key: string}} event 
     */
    handleKeyPress = isChild
        ? (event) =>
        {
            if (!this.keys[event.key]) return
            window.top?.postMessage(JSON.stringify({ key: event.key, chroma: 'scripts' }))
        }
        : (event) =>
        {
            if (!this.keys[event.key]) return
            for (const binding of this.keys[event.key]) {
                this.safeCall(binding)
            }
        }

    /**
     * Call a function safely. Catches and logs errors but does not
     * interrupt execution.
     *
     * @param {KeyBinding} binding 
     */
    safeCall (binding)
    {
        try {
            binding()
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * Add a keypress handler for a specific key.
     * 
     * @param {string} key 
     * @param {KeyBinding} handler 
     */
    on (key, handler)
    {
        if (!this.keys[key]) this.keys[key] = new Set()
        this.keys[key].add(handler)
    }

    /**
     * Remove a keypress handler for a specific key.
     * 
     * @param {string} key 
     * @param {KeyBinding} handler 
     */
    off (key, handler)
    {
        if (!this.keys[key]) return
        this.keys[key].delete(handler)
        if (this.keys[key].size() === 0) delete this.keys[key]
    }
}

/**
 * Wait for the docuent body, then slam in some html.
 *
 * @param {string} html 
 * 
 * @returns {Promise<void>} A promise that resolves when the html has been appended.
 */
async function appendHTML (html)
{
    const div = document.createElement('div')
    div.innerHTML = html

    const body = await waitForBody()
    const output = []
    for (const child of div.children) {
        output.push(child)
        body.append(child)
    }
    return output.length <= 1 ? output[0] : output
}

async function init ()
{
    const options = await chrome.storage.sync.get(['ignoreMedia'])
    const darkMode = new LazyDarkMode(options)

    const menu = new Menu(darkMode)
    const keybindings = new KeyBindings()

    keybindings.on('∂', () => darkMode.toggle())
    keybindings.on('Î', () => menu.toggle())

    await menu.createElement() // eager creation
    await appendHTML(SVGFilter)
    await appendHTML(filterStyle)

    darkMode.setFilter('luminance')
}

init()
