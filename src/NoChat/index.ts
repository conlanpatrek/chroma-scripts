import { onSelector } from 'chroma/util/onSelector'

// Click the close chat button automatically
onSelector<HTMLButtonElement>(
    'yt-live-chat-app #close-button button',
    button => button.click()
)