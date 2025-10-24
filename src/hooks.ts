"use client";
import {
  type RefObject,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export function useShadowRoot(
  init: ShadowRootInit,
): [ref: RefObject<Element | null>, root: ShadowRoot | null] {
  const [shadowRoot, setState] = useState<ShadowRoot | null>(null);
  const ref = useRef<Element>(null);

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

  return [ref, shadowRoot];
}
