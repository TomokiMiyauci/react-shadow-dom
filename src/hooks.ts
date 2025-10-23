"use client";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";

export function useShadowRoot(
  init: ShadowRootInit,
): [ref: RefObject<Element | null>, root: ShadowRoot | null] {
  const {
    mode,
    serializable,
    slotAssignment,
    customElementRegistry,
    delegatesFocus,
    clonable,
  } = init;
  const [shadowRoot, setState] = useState<ShadowRoot | null>(null);
  const ref = useRef<Element>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (ref.current.shadowRoot) {
      ref.current.shadowRoot.replaceChildren();
      setState(ref.current.shadowRoot);
    } else {
      const root = ref.current.attachShadow({
        mode,
        serializable,
        slotAssignment,
        customElementRegistry,
        delegatesFocus,
        clonable,
      });
      setState(root);
    }
  }, [
    ref,
    mode,
    serializable,
    slotAssignment,
    customElementRegistry,
    delegatesFocus,
    clonable,
  ]);

  return [ref, shadowRoot];
}
