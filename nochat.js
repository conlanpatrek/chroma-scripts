function onSelector (selector, cb)
{
    const loop = () =>
    {
        const result = document.querySelector(selector)
        if (result) cb(result)
        requestAnimationFrame(loop)
    }

    loop()
}

// No chat
onSelector(
    'yt-live-chat-app #close-button button',
    button => button.click()
)

// No ads
//onSelector('yt-live-chat-app #close-button button', button => button.click())
