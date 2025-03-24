
const isChild = window.self !== window.top

const earliestStyle = document.createElement('style')

// recalculate the background
setInterval(() => {
    if (earliestStyle.innerHTML === '') return
    updateHTMLBackground()
}, 1000)

function updateHTMLBackground ()
{
    earliestStyle.innerHTML = '' // wipe existing styles.

    // Update styles
    earliestStyle.innerHTML = `
        @layer lowest {
            html {
                background-color: ${getViewportBackgroundColor()};
            }
        }
    `.split('\n').map(row => row.trim()).join('\n')

    // Move to start of head for lowest possible specificity
    if (document.head.children[0] !== earliestStyle)
        document.head.prepend(earliestStyle)
}

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

    // Whether or not we should ignore media (img, video, iframes)
    ignoreMedia = false

    // Default to off
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
        earliestStyle.innerHTML = ''
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
        updateHTMLBackground()
    }

    get dataAttr ()
    {
        const suffix = this.ignoreMedia ? '-no-media' : ''
        return `invert${suffix}`
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
        // todo: beter.
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
            if (this.isClosed) return
            if (this._isInsideElement(e.clientX, e.clientY, this.element)) return
            this.close()
        })

        const ignoreMediaInput = document.getElementById('∂-ignore-media')
        ignoreMediaInput.checked = this.ldm.ignoreMedia
        ignoreMediaInput.addEventListener('change', this.handleIgnoreMediaToggle)
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {HTMLElement} element
     */
    _isOutsideElement (x, y, element)
    {
        const rect = element.getBoundingClientRect()
    
        if (x < rect.left) return true
        if (x > rect.right) return true
        if (y < rect.top) return true
        if (y > rect.bottom) return true
    
        return false
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {HTMLElement} element
     */
    _isInsideElement (x, y, element)
    {
        return !this._isOutsideElement(x, y, element)
    }

    get isClosed ()
    {
        return !this.isOpen
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

const lerp = (a, b, t) => a + (b - a) * t

function getViewportBackgroundColor ()
{
    let color = getElementColor(document.documentElement)
    if (color[3] === 0 && document.body) color = getElementColor(document.body)
    if (color[3] === 0) return 'white'

    const a = color[3]
    const r = lerp(255, color[0], a) >> 0
    const g = lerp(255, color[1], a) >> 0
    const b = lerp(255, color[2], a) >> 0

    return `rgb(${r}, ${g}, ${b})`
}

function getElementColor (maybeElement)
{
    if (maybeElement instanceof Element === false) return [0, 0, 0, 0]
    return parseColor(getComputedStyle(maybeElement).backgroundColor)
}

/**
 * @param {string} color 
 */
function parseColor (color)
{
    const open = color.indexOf('(')
    const close = color.indexOf(')')
    const op = color.substring(open + 1, close).split(',')
    if (op.length === 3) op.push(1)
    if (op.length !== 4) console.error(color, op)
    return op.map(val => parseInt(val, 10))
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
}

init()