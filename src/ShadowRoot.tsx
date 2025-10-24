"use client";
import { createPortal } from "react-dom";
import { type JSX, type ReactNode, useCallback } from "react";
import { useShadowRoot } from "./hooks.ts";

/**
 * Props for {@link ShadowRoot} component.
 */
export interface ShadowRootProps extends ShadowRootInit {
  /**
   * Shadow root children.
   */
  children?: ReactNode;
}

/**
 * Attach a [shadow root](https://developer.mozilla.org/en-US/docs/Glossary/Shadow_tree) to the parent.
 */
export default function ShadowRoot(props: ShadowRootProps): JSX.Element {
  const {
    children,
    mode,
    clonable,
    delegatesFocus,
    serializable,
    slotAssignment,
    customElementRegistry,
  } = props;
  const [ref, shadowRoot] = useShadowRoot({
    mode,
    clonable,
    delegatesFocus,
    serializable,
    slotAssignment,
    customElementRegistry,
  });
  const callbackRef = useCallback((el: HTMLDivElement | null) => {
    if (el) ref.current = el.parentElement;
  }, [ref]);

  return (
    // TODO(miyauci): Refactor to using Fragment ref
    <div ref={callbackRef}>
      {shadowRoot && createPortal(children, shadowRoot)}
    </div>
  );
}
