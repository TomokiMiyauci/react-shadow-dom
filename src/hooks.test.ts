import { renderHook } from "@testing-library/react";
import { after, before, describe, it } from "@std/testing/bdd";
import globalJsdom from "global-jsdom";
import { useRenderMode, useShadowRoot } from "./hooks.ts";
import { expect } from "@std/expect";
import { renderHookOnServer } from "~/tests/mod.ts";

describe("useRenderMode", () => {
  describe("server side", () => {
    it("should return ssr", () => {
      const result = renderHookOnServer(() => useRenderMode());

      expect(result).toBe("ssr");
    });
  });

  describe("hydrate", () => {
    it("should return hydrate", () => {
      const result = renderHookOnServer(() => useRenderMode());

      expect(result).toBe("hydrate");
    });

    before<{ cleanup: VoidFunction }>(function () {
      this.cleanup = globalJsdom();
    });

    after<{ cleanup: VoidFunction }>(function () {
      this.cleanup();
    });
  });

  describe("client side", () => {
    it("should return csr", () => {
      const { result } = renderHook(() => useRenderMode());

      expect(result.current).toBe("csr");
    });

    before<{ cleanup: VoidFunction }>(function () {
      this.cleanup = globalJsdom();
    });

    after<{ cleanup: VoidFunction }>(function () {
      this.cleanup();
    });
  });
});

describe("useShadowRoot", () => {
  it("should return attached shadow root", () => {
    const div = document.createElement("div");

    const { result: { current: shadowRoot } } = renderHook(() => {
      const [ref, shadowRoot] = useShadowRoot({ mode: "open" });

      ref.current = div;

      return shadowRoot;
    });

    expect(shadowRoot).not.toBeNull();
    expect(div.shadowRoot).toBe(shadowRoot);
  });

  it("should return attached shadow if the element has attached", () => {
    const div = document.createElement("div");
    const attached = div.attachShadow({ mode: "open" });

    const { result: { current: shadowRoot } } = renderHook(() => {
      const [ref, shadowRoot] = useShadowRoot({ mode: "open" });

      ref.current = div;

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
      const [ref, shadowRoot] = useShadowRoot({ mode: "open" });

      ref.current = div;

      return shadowRoot;
    });

    expect(attached.hasChildNodes()).toBeFalsy();
  });

  it("should return null if the ref is null", () => {
    const { result: { current } } = renderHook(() => {
      return useShadowRoot({ mode: "open" });
    });

    const [ref, shadowRoot] = current;
    expect(ref.current).toBeNull();
    expect(shadowRoot).toBeNull();
  });

  before<{ cleanup: VoidFunction }>(function () {
    this.cleanup = globalJsdom();
  });

  after<{ cleanup: VoidFunction }>(function () {
    this.cleanup();
  });
});
