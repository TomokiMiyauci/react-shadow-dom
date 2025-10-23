import Template from "./Template.tsx";
import { after, before, describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
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
          renderToStaticMarkup(<Template shadowRootMode="open" />),
        );
      });

      it("with children", async (t) => {
        await assertSnapshot(
          t,
          renderToStaticMarkup(
            <Template shadowRootMode="open">
              <slot />
            </Template>,
          ),
        );
      });

      it("with full props", async (t) => {
        await assertSnapshot(
          t,
          renderToStaticMarkup(
            <Template
              shadowRootMode="open"
              shadowRootClonable
              shadowRootDelegatesFocus
              shadowRootSerializable
            >
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
          <Template shadowRootMode="open">
            <slot />
          </Template>
        </div>,
      );

      const host = result.getByTestId("host");

      expect(host.shadowRoot).not.toBeNull();
      expect(host.shadowRoot?.hasChildNodes()).toBeTruthy();
    });

    it(
      "should hydrate shadow dom, but render it now",
      () => {
        const container = document.createElement("div");
        const shadowDom = container.attachShadow({ mode: "open" });
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        shadowDom.appendChild(button);

        expect(shadowDom.childElementCount).toBe(1);

        const fn = spy();
        render(
          <Template shadowRootMode="open">
            <button id="test" type="button" onClick={fn}></button>
          </Template>,
          { container },
        );

        expect(shadowDom.childElementCount).toBe(1);

        assertSpyCalls(fn, 0);
        button.click();
        assertSpyCalls(fn, 0);

        shadowDom.getElementById("test")?.click();
        assertSpyCalls(fn, 1);
      },
    );

    it("should remove shadow dom content on unmount", () => {
      const result = render(
        <Template shadowRootMode="open">
          <slot />
        </Template>,
      );

      const host = result.container.shadowRoot;

      expect(host).not.toBeNull();
      expect(host?.hasChildNodes()).toBeTruthy();

      result.unmount();

      expect(host?.hasChildNodes()).toBeFalsy();
    });

    it("should rerender", () => {
      const result = render(
        <Template shadowRootMode="open">
          <slot />
        </Template>,
      );

      const host = result.container.shadowRoot;

      expect(host).not.toBeNull();
      expect(host?.childElementCount).toBe(1);

      result.rerender(
        <Template shadowRootMode="open">
          <slot />
          <slot />
        </Template>,
      );

      expect(host?.childElementCount).toBe(2);
    });

    it("should not detect hydration errors", () => {
      const host = document.createElement("div");
      const shadowRoot = host.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = "<div></div>";

      expect(shadowRoot.innerHTML).toBe("<div></div>");

      expect(() => {
        render(
          <Template shadowRootMode="open">
            <slot></slot>
          </Template>,
          { container: host },
        );
      }).not.toThrow();
    });
  });
});
