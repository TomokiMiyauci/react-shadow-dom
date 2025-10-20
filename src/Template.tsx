"use client";
import { Fragment, type JSX } from "react";
import { useRenderMode } from "./hooks.ts";
import type { TemplateProps } from "./types.ts";
import ShadowRoot from "./ShadowRoot.tsx";

export default function Template(
  props: TemplateProps & JSX.IntrinsicElements["template"],
): JSX.Element {
  const renderMode = useRenderMode();

  switch (renderMode) {
    case "ssr":
    case "csr":
      return <ShadowRoot {...props} />;
    case "hydrate":
      return <Fragment />;
  }
}
