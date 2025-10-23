"use client";
import { type JSX } from "react";
import ShadowRoot from "./ShadowRoot.tsx";
import { boolish } from "./utils.ts";

export interface TemplateProps extends HTMLTemplateElementProps {
  /**
   * @default !("window" in globalThis)
   */
  ssr?: boolean;
}

export interface HTMLTemplateElementProps {
  shadowRootMode: "open" | "closed";
  shadowRootClonable?: boolean;
  shadowRootDelegatesFocus?: boolean;
  shadowRootSerializable?: boolean;
}

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

  return (
    <>
      {ssr && <template {...templateProps} />}

      <ShadowRoot
        mode={mode}
        clonable={clonable}
        delegatesFocus={delegatesFocus}
        serializable={serializable}
      >
        {children}
      </ShadowRoot>
    </>
  );
}
