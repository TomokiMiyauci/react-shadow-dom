"use client";
import {
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export type RenderMode = "ssr" | "hydrate" | "csr";

function getNoop(): VoidFunction {
  return noop;
}

function noop(): void {}

function getSnapshot(): "csr" {
  return "csr";
}

function getServerSnapshot(): "hydrate" | "ssr" {
  return "window" in globalThis ? "hydrate" : "ssr";
}

export function useRenderMode(): RenderMode {
  return useSyncExternalStore(getNoop, getSnapshot, getServerSnapshot);
}

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
