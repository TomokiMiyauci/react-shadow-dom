import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { boolish } from "./utils.ts";

describe("bolish", () => {
  it(`should return "true" if true`, () => {
    expect(boolish(true)).toBe("true");
  });

  it(`should return "false" if false`, () => {
    expect(boolish(false)).toBe("false");
  });

  it(`should return undefined if undefined`, () => {
    expect(boolish(undefined)).toBe(undefined);
  });
});
