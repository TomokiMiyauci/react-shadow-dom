# react-shadow-dom

[![JSR](https://jsr.io/badges/@miyauci/react-shadow-dom)](https://jsr.io/@miyauci/react-shadow-dom)

<p>
  <a href="https://web-platform-dx.github.io/web-features/supported-browsers/?targetYear=2024">
  <img alt="baseline" src="https://web-platform-dx.github.io/web-features/assets/img/baseline-newly-icon.svg" height="16px" />
  </a>
  Newly available across major browsers (Baseline since 2024)
</p>

> A utility for the
> [Shadow DOM](https://developer.mozilla.org/docs/Web/API/Web_components/Using_shadow_DOM)
> in React

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

This library provides two main components: `Template` and `ShadowRoot`.

### Template

Provides a method for implementing
[Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom) in
React.

The `Template` is `<template>`. However, it adjusts Shadow DOM hydration.

When `shadowRootMode` is specified, the browser automatically attaches the
[ShadowRoot](https://developer.mozilla.org/docs/Glossary/Shadow_tree). The
`Template` adjusts the VDOM on the client side to prevent hydration errors.

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

## License

[MIT](./LICENSE) © Tomoki Miyauchi
