import { createElement, Fragment } from "react";
import { renderToString } from "react-dom/server";

export function renderHookOnServer<Result>(
  fn: () => Result,
): Result {
  let result: undefined | { hook: Result };

  function App() {
    const hook = fn();
    result = { hook };

    return createElement(Fragment);
  }

  renderToString(createElement(App));

  if (!result) {
    throw new Error("hook has not been called");
  }

  return result.hook;
}
