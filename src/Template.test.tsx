import Template from "./Template.tsx";
import { after, before, describe, it } from "@std/testing/bdd";
import { assertSnapshot } from "@std/testing/snapshot";
import { renderToStaticMarkup } from "react-dom/server";
import globalJsdom from "global-jsdom";
import { render } from "@testing-library/react";
import { expect } from "@std/expect";

describe("Template", () => {
  describe("ssr", () => {
    describe("snapshot", () => {
      it("default", async (t) => {
        await assertSnapshot(
          t,
          renderToStaticMarkup(<Template shadowrootmode="open" />),
        );
      });

      it("with children", async (t) => {
        await assertSnapshot(
          t,
          renderToStaticMarkup(
            <Template shadowrootmode="open">
              <slot />
            </Template>,
          ),
        );
      });
    });
  });

  describe("csr", () => {
    before<{ cleanup: VoidFunction }>(function () {
      this.cleanup = globalJsdom();
    });

    after<{ cleanup: VoidFunction }>(function () {
      this.cleanup();
    });

    it("should attach shadow root", () => {
      const result = render(
        <div data-testid="host">
          <Template shadowrootmode="open">
            <slot />
          </Template>
        </div>,
      );

      const host = result.getByTestId("host");

      expect(host.shadowRoot).not.toBeNull();
      expect(host.shadowRoot?.hasChildNodes()).toBeTruthy();
      expect(host.hasChildNodes()).toBeFalsy();
    });

    it("should remove shadow dom on unmount", () => {
      const result = render(
        <Template shadowrootmode="open">
          <slot />
        </Template>,
      );

      const host = result.container.shadowRoot;

      expect(host).not.toBeNull();
      expect(host?.hasChildNodes()).toBeTruthy();

      result.unmount();

      expect(host?.hasChildNodes()).toBeFalsy();
    });

    it("should overwrite if the host already has shadow root", () => {
      const host = document.createElement("div");
      const shadowRoot = host.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = "<div></div>";

      expect(shadowRoot.innerHTML).toBe("<div></div>");

      render(
        <Template shadowrootmode="open">
          <slot></slot>
        </Template>,
        { container: host },
      );

      expect(shadowRoot.innerHTML).toBe("<slot></slot>");
    });
  });
});
