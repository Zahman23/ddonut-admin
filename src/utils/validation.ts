import z from "zod";

export const trimString = (val: unknown) => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return val;
};

export const optionalTrimmedString = (min?: number, max?: number) =>
  z
    .string()
    .trim()
    .min(min ?? 1, `minimal karakter ${min}`)
    .max(max ?? 255, `maximal karakter ${max}`)
    .optional();
