export function isTop()
{
    return window.self === window.top
}

export function isChild()
{
    return window.self !== window.top
}
