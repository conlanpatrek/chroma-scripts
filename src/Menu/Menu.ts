import { LazyDarkMode } from 'chroma/LazyDarkMode/LazyDarkMode'
import menuMarkup from './Menu.html'
import { waitForBody } from 'chroma/util/waitFor'

export class Menu
{
    isOpen: boolean = false

    container: HTMLDivElement
    dialog: HTMLDialogElement
    shadowRoot: ShadowRoot

    ldm: LazyDarkMode

    constructor(ldm: LazyDarkMode)
    {
        this.ldm = ldm
        this.shadowRoot = this.createElement()
        this.appendToBody()
    }

    async appendToBody()
    {
        const body = await waitForBody()
        body.append(this.container)
    }

    createElement(): ShadowRoot
    {
        this.container = this.container ?? document.createElement('div')

        this.container.style.position = 'absolute !important'
        this.container.style.width = '0'
        this.container.style.height = '0'
        this.container.style.left = '0'
        this.container.style.top = '0'

        const shadow = this.container.attachShadow({ mode: 'open' })
        shadow.innerHTML = menuMarkup

        this.dialog = shadow.querySelector('dialog')!

        this.dialog.addEventListener('click', e =>
        {
            if (this.isClosed) return
            if (this.isInsideElement(e.clientX, e.clientY, this.dialog)) return
            this.close()
        })

        const ignoreMediaInput = shadow.querySelector('#∂-ignore-media') as HTMLInputElement
        ignoreMediaInput.checked = this.ldm.config.ignoreMedia
        ignoreMediaInput.addEventListener('change', this.handleIgnoreMediaToggle)

        return shadow
    }

    private isOutsideElement (x: number, y: number, element: HTMLElement)
    {
        const rect = element.getBoundingClientRect()
    
        if (x < rect.left) return true
        if (x > rect.right) return true
        if (y < rect.top) return true
        if (y > rect.bottom) return true
    
        return false
    }

    private isInsideElement (x: number, y: number, element: HTMLElement)
    {
        return !this.isOutsideElement(x, y, element)
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
        if (this.isOpen || !this.shadowRoot) return
        this.isOpen = true
        this.dialog.showModal()
    }

    close ()
    {
        if (!this.isOpen || !this.shadowRoot) return
        this.isOpen = false
        this.dialog.close()
    }

    handleIgnoreMediaToggle = (event: Event) =>
    {
        if (!event.target) return
        const target = event.target as HTMLInputElement
        const ignoreMedia = !!target.checked
        this.ldm.setIgnoreMedia(ignoreMedia)
        chrome.storage.sync.set({ ignoreMedia })
    }
}