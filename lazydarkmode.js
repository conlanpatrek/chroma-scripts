const SVGFilter = `
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="display:none;">
        <filter id="invert-lightness" color-interpolation-filters="sRGB">
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

    // The document element
    static html = document.documentElement

    // Whether lazy dark mode is enabled
    enabled = false

    // The inversion technique. For page load, we'll use invert() until
    // we have a document body to append an svg filter to.
    filter = 'invert(1)'

    constructor()
    {
        // Lookup the current LDM state.
        this.enabled = localStorage.getItem(LazyDarkMode.DARK_MODE) === LazyDarkMode.ON
        
        // Sync with the doc.
        if (this.enabled) this.enable()
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
        localStorage.removeItem(LazyDarkMode.DARK_MODE)
        LazyDarkMode.html.style.filter = ''
    }

    /**
     * Turn on document filtering.
     * 
     * Also updates local storage.
     */
    enable ()
    {
        this.enabled = true
        localStorage.setItem(LazyDarkMode.DARK_MODE, LazyDarkMode.ON)
        LazyDarkMode.html.style.filter = this.filter
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
        window.addEventListener('keydown', this.handleKeyPress, { capture: true })
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
    for (const child of div.children) {
        body.append(child)
    }
}

async function init ()
{
    const darkMode = new LazyDarkMode()
    const keybindings = new KeyBindings()

    keybindings.on('∂', () => darkMode.toggle())

    await appendHTML(SVGFilter)
    darkMode.setFilter('url(#invert-lightness)')
}

init()
