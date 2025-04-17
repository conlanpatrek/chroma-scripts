# BackgroundColorListener

All this module does is poll for changes to the root document's background color,
and if it changes, emits an event.

## Usage

```ts

import { backgroundColor } from 'chroma/BackgroundColorListener'

const echoColor = (color: string) => {
    console.log(string)
}

// Add a listener, this will call your handler immediately with the current value,
// and then again every time the background updates.
backgroundColor.addListener(echoColor)

// Remove the listener.
backgroundColor.removeListener(echoColor)

// You can also check the current value at any point in time.
console.log(backgroundColor.current)

```
