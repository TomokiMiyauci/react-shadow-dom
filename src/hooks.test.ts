import { renderHook } from "@testing-library/react";
import { after, before, describe, it } from "@std/testing/bdd";
import globalJsdom from "global-jsdom";
import { useRenderMode } from "./hooks.ts";
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
