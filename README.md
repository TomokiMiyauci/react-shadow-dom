# react-shadow-dom

A utility for the
[Shadow DOM](https://developer.mozilla.org/docs/Web/API/Web_components/Using_shadow_DOM)
in React

## Background

Shadow DOM is a powerful web feature.
[Slot](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/slot) and
[style encapsulation](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#encapsulation_from_css)
work exceptionally well with JSX as templates. Unfortunately, React's Shadow DOM
support is limited.

This project provides utilities for working with Shadow DOM in React.

## Install

Deno:

```bash
deno add jsr:@miyauci/react-shadow-dom
```

Node.js

```bash
npx jsr add @miyauci/react-shadow-dom
```

## Usage

`Template` is a wrapper for representing
`<template shadowrootmode="open|close">` in React.

```tsx
import { Template } from "@miyauci/react-shadow-dom";

<div>
  <Template shadowRootMode="open">
    <button>
      <slot name="icon" />
      <slot />
    </button>
  </Template>

  <span slot="icon" className="my-icon" />
  Label
</div>;
```

Avoids hydration errors and can be used with any rendering method (SSR, CSR,
RSC, Hydration).

## License

[MIT](./LICENSE) © Tomoki Miyauchi
