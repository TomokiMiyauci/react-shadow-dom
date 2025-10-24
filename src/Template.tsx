"use client";
import type { JSX } from "react";
import ShadowRoot from "./ShadowRoot.tsx";
import { boolish } from "./utils.ts";

/**
 * Props for {@link Template} component.
 */
export interface TemplateProps {
  /**
   * Creates a [shadow root](https://developer.mozilla.org/docs/Glossary/Shadow_tree) for the parent element. It is a declarative version of the [`Element.attachShadow()`](https://developer.mozilla.org/docs/Web/API/Element/attachShadow) method and accepts the same enumerated values.
   *
   * - `open` Exposes the internal shadow root DOM for JavaScript (recommended for most use cases).
   * - `closed` Hides the internal shadow root DOM from JavaScript.
   */
  shadowRootMode?: "open" | "closed";

  /**
   * Sets the value of the [clonable](https://developer.mozilla.org/docs/Web/API/ShadowRoot/clonable) property of a [ShadowRoot](https://developer.mozilla.org/docs/Web/API/ShadowRoot) created using this element to `true`.
   * If set, a clone of the shadow host (the parent element of this `<template>`) created with [`Node.cloneNode()`](https://developer.mozilla.org/docs/Web/API/Node/cloneNode) or [`Document.importNode()`](https://developer.mozilla.org/docs/Web/API/Document/importNode) will include a shadow root in the copy.
   */
  shadowRootClonable?: boolean;

  /**
   * Sets the value of the [delegatesFocus](https://developer.mozilla.org/docs/Web/API/ShadowRoot/delegatesFocus) property of a [ShadowRoot](https://developer.mozilla.org/docs/Web/API/ShadowRoot) created using this element to `true`.
   * If this is set and a non-focusable element in the shadow tree is selected, then focus is delegated to the first focusable element in the tree.
   */
  shadowRootDelegatesFocus?: boolean;

  /**
   * Sets the value of the [serializable](https://developer.mozilla.org/docs/Web/API/ShadowRoot/serializable) property of a [ShadowRoot](https://developer.mozilla.org/docs/Web/API/ShadowRoot) created using this element to `true`.
   * If set, the shadow root may be serialized by calling the [`Element.getHTML()`](https://developer.mozilla.org/docs/Web/API/Element/getHTML) or [`ShadowRoot.getHTML()`](https://developer.mozilla.org/docs/Web/API/ShadowRoot/getHTML) methods with the `options.serializableShadowRoots` parameter set `true`.
   */
  shadowRootSerializable?: boolean;

  /**
   * Whether it is server-side rendering or not.
   * Normally, you do not need to specify this.
   *
   * @default !("window" in globalThis)
   */
  ssr?: boolean;
}

/**
 * HTML `template` wrapper. It adjusts shadow DOM hydration.
 *
 * When {@link TemplateProps.shadowRootMode shadowRootMode} is specified, the browser automatically attaches the
 * [`ShadowRoot`](https://developer.mozilla.org/docs/Glossary/Shadow_tree). The
 * {@link Template} adjusts the VDOM on the client side to prevent hydration
 * errors.
 *
 * @example
 * ```tsx
 * import { Template } from "@miyauci/react-shadow-dom";
 *
 * <div>
 *   <Template shadowRootMode="open">
 *     <button>
 *       <slot name="icon" />
 *       <slot />
 *     </button>
 *   </Template>
 *
 *   <span slot="icon" className="my-icon" />
 *   Label
 * </div>;
 * ```
 */
export default function Template(
  props: TemplateProps & JSX.IntrinsicElements["template"],
): JSX.Element {
  const {
    ssr = !("window" in globalThis),
    shadowRootMode: mode,
    shadowRootClonable: clonable,
    shadowRootDelegatesFocus: delegatesFocus,
    shadowRootSerializable: serializable,
    ...rest
  } = props;
  const templateProps = {
    ...rest,
    shadowrootmode: mode,
    shadowrootclonable: boolish(clonable),
    shadowrootdelegatesfocus: boolish(delegatesFocus),
    shadowrootserializable: boolish(serializable),
  };
  const { children } = templateProps;
  // If mode is not specified, it is always true. If mode is specified, it is true for ssr.
  const isRender = !mode || ssr;

  return (
    <>
      {isRender && <template {...templateProps} />}

      {mode && (
        <ShadowRoot
          mode={mode}
          clonable={clonable}
          delegatesFocus={delegatesFocus}
          serializable={serializable}
        >
          {children}
        </ShadowRoot>
      )}
    </>
  );
}
