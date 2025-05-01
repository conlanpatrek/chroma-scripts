export const chroma = 'scripts'

export interface ChromaMessage<T = any> {
    chroma: typeof chroma,
    type: string,
    payload: T
}
