import { Color } from 'chroma/BackgroundColorListener/types'
import { backgroundColor } from 'chroma/BackgroundColorListener'
import { waitForHead } from 'chroma/util/waitFor'

const earliestStyle = document.createElement('style')

let enabled = true
const rules = "display: block; content: ''; position: fixed; inset: 0; z-index: -999999;"

// Ensure the background color is set explicitly
async function updateHTMLBackground(color: Color = backgroundColor.current)
{
    // Early return and clear if we're not inverting anything.
    if (!enabled) {
        earliestStyle.innerHTML = ''
        return
    }

    // Update styles
    earliestStyle.innerHTML = `@layer lowest { html::before { background-color: ${color}; ${rules} } }`

    // Move to start of head for lowest possible specificity
    const head = await waitForHead()
    if (head.children[0] !== earliestStyle) head.prepend(earliestStyle)
}

export function forceExplicitBackground()
{
    backgroundColor.addListener(updateHTMLBackground)
}

export function setEnabled(value: boolean)
{
    if (enabled === value) return
    enabled = value
    updateHTMLBackground()
}
