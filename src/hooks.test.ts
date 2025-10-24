import { renderHook } from "@testing-library/react";
import { after, before, describe, it } from "@std/testing/bdd";
import globalJsdom from "global-jsdom";
import { useShadowRoot } from "./hooks.ts";
import { expect } from "@std/expect";

describe("useShadowRoot", () => {
  it("should return attached shadow root", () => {
    const div = document.createElement("div");

    const { result: { current: shadowRoot } } = renderHook(() => {
      const shadowRoot = useShadowRoot({ current: div }, {
        mode: "open",
      });

      return shadowRoot;
    });

    expect(shadowRoot).not.toBeNull();
    expect(div.shadowRoot).toBe(shadowRoot);
  });

  it("should return attached shadow if the element has attached", () => {
    const div = document.createElement("div");
    const attached = div.attachShadow({ mode: "open" });

    const { result: { current: shadowRoot } } = renderHook(() => {
      const shadowRoot = useShadowRoot({ current: div }, { mode: "open" });

      return shadowRoot;
    });

    expect(attached).toBe(shadowRoot);
  });

  it("should return clean shadow dom if the element has attached", () => {
    const div = document.createElement("div");
    const attached = div.attachShadow({ mode: "open" });
    attached.appendChild(document.createElement("slot"));

    expect(attached.hasChildNodes()).toBeTruthy();

    renderHook(() => {
      const shadowRoot = useShadowRoot({ current: div }, { mode: "open" });

      return shadowRoot;
    });

    expect(attached.hasChildNodes()).toBeFalsy();
  });

  it("should return null if the ref is null", () => {
    const { result: { current: shadowRoot } } = renderHook(() => {
      return useShadowRoot({ current: null }, { mode: "open" });
    });

    expect(shadowRoot).toBeNull();
  });

  before<{ cleanup: VoidFunction }>(function () {
    this.cleanup = globalJsdom();
  });

  after<{ cleanup: VoidFunction }>(function () {
    this.cleanup();
  });
});
