"use client";
import { createPortal } from "react-dom";
import { type JSX, type ReactNode, useCallback, useRef } from "react";
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
 * Container attached as a shadow root on the client side.
 * Using the {@link ShadowRoot} as a boundary, render {@link ShadowRootProps.children children} into the parent
 * element's shadow root.
 *
 * @example
 * ```tsx
 * import { ShadowRoot } from "@miyauci/react-shadow-dom";
 *
 * <div>
 *   <ShadowRoot mode="open">
 *    <style>
 *     {`* {
 *    color: gray;
 *   }
 * `}
 *    </style>
 *     <button>
 *       <slot name="icon" />
 *       <slot />
 *     </button>
 *   </ShadowRoot>
 *
 *   <span slot="icon" className="my-icon" />
 *   Label
 * </div>;
 * ```
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
  const ref = useRef<Element>(null);
  const shadowRoot = useShadowRoot(ref, {
    mode,
    clonable,
    delegatesFocus,
    serializable,
    slotAssignment,
    customElementRegistry,
  });

  const callbackRef = useCallback((el: HTMLTemplateElement | null) => {
    if (el) ref.current = el.parentElement;
  }, [ref]);

  return (
    // TODO(miyauci): Refactor to using Fragment ref
    <template ref={callbackRef}>
      {shadowRoot && createPortal(children, shadowRoot)}
    </template>
  );
}
