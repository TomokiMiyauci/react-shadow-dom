"use client";
import { createPortal } from "react-dom";
import { type JSX, type ReactNode, useCallback } from "react";
import type { TemplateProps } from "./types.ts";
import { useShadowRoot } from "./hooks.ts";

export interface ShadowRootProps extends TemplateProps {
  children?: ReactNode;
}

export default function ShadowRoot(
  props: ShadowRootProps & JSX.IntrinsicElements["template"],
): JSX.Element {
  const {
    children,
    shadowrootmode,
    shadowrootclonable,
    shadowrootdelegatesfocus,
    shadowrootserializable,
  } = props;
  const [ref, shadowRoot] = useShadowRoot({
    mode: shadowrootmode,
    clonable: shadowrootclonable,
    delegatesFocus: shadowrootdelegatesfocus,
    serializable: shadowrootserializable,
  });
  const callbackRef = useCallback((el: HTMLTemplateElement | null) => {
    if (el) ref.current = el.parentElement;
  }, [ref]);

  if (shadowRoot) return createPortal(children, shadowRoot);
  return <template ref={callbackRef} {...props} />;
}
