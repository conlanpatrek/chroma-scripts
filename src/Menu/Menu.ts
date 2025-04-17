import { LazyDarkMode } from 'chroma/LazyDarkMode/LazyDarkMode'
import menuMarkup from './Menu.html'
import { waitForBody } from 'chroma/util/waitFor'

export class Menu
{
    isOpen: boolean = false

    element: HTMLDialogElement

    ldm: LazyDarkMode

    constructor(ldm: LazyDarkMode)
    {
        this.ldm = ldm
        this.element = this.createElement()
        this.appendToBody()
    }

    async appendToBody()
    {
        const body = await waitForBody()
        body.append(this.element)
    }

    createElement(): HTMLDialogElement
    {
        const element = document.createElement('dialog')
        element.className = '∂'
        element.innerHTML = menuMarkup

        element.addEventListener('click', e =>
        {
            if (this.isClosed) return
            if (this.isInsideElement(e.clientX, e.clientY, element)) return
            this.close()
        })

        const ignoreMediaInput = element.querySelector('#∂-ignore-media') as HTMLInputElement
        ignoreMediaInput.checked = this.ldm.config.ignoreMedia
        ignoreMediaInput.addEventListener('change', this.handleIgnoreMediaToggle)

        return element
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

    handleIgnoreMediaToggle = (event: Event) =>
    {
        if (!event.target) return
        const target = event.target as HTMLInputElement
        const ignoreMedia = !!target.checked
        this.ldm.setIgnoreMedia(ignoreMedia)
        chrome.storage.sync.set({ ignoreMedia })
    }
}