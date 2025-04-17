# KeyBindings

This module simplifies shortcut creation by allowing for single key handlers.

## Usage

```ts
import { bind, unbind } from 'chroma/KeyBindings'

const myHandler = () => {
    // Do something
}

// When the user presses a, fire the handler
bind('a', myHandler)

// When the user presses shift + a, fire the handler
bind('A', myHandler)

// Deregister binding from the key
unbind('a', myHandler)

```