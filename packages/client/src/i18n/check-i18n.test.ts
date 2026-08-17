import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "locales");

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flatten(value as Record<string, unknown>, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

describe("i18n parity", () => {
  it("en.json and ru.json have matching keys", () => {
    const files = readdirSync(localesDir)
      .filter((f) => f.endsWith(".json"))
      .sort();

    const reference = JSON.parse(readFileSync(join(localesDir, files[0]), "utf-8"));
    const target = JSON.parse(readFileSync(join(localesDir, files[1]), "utf-8"));

    const refFlat = flatten(reference);
    const targetFlat = flatten(target);

    const missing = Object.keys(refFlat).filter((key) => !(key in targetFlat));
    const extra = Object.keys(targetFlat).filter((key) => !(key in refFlat));

    expect(missing).toEqual([]);
    expect(extra).toEqual([]);
  });

  it("meta.nativeName and meta.direction exist in all locales", () => {
    const files = readdirSync(localesDir)
      .filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const content = JSON.parse(readFileSync(join(localesDir, file), "utf-8"));
      expect(content.meta.nativeName).toBeDefined();
      expect(content.meta.direction).toBeDefined();
    }
  });
});
