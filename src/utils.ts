export function boolish(
  value: boolean | undefined,
): "true" | "false" | undefined {
  if (typeof value === "undefined") return;

  if (value) return "true";
  return "false";
}
