"use client";
import {
  type RefObject,
  useEffectEvent,
  useLayoutEffect,
  useState,
} from "react";

/**
 * Hook for getting reference to shadow root.
 */
export function useShadowRoot(
  ref: RefObject<Element | null>,
  init: ShadowRootInit,
): ShadowRoot | null {
  const [shadowRoot, setState] = useState<ShadowRoot | null>(null);

  // Shadow DOM can only be created once.
  const attchShadow = useEffectEvent((el: Element) => {
    return el.attachShadow(init);
  });

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (ref.current.shadowRoot) {
      ref.current.shadowRoot.replaceChildren();
      setState(ref.current.shadowRoot);
    } else {
      const root = attchShadow(ref.current);
      setState(root);
    }
  }, []);

  return shadowRoot;
}
