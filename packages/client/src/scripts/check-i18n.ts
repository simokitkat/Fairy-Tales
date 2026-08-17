import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const localesDir = join(import.meta.dirname, "..", "i18n", "locales");

const files = readdirSync(localesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (files.length === 0) {
  console.log("No locale files found.");
  process.exit(0);
}

const referenceFile = files[0];
const reference = JSON.parse(readFileSync(join(localesDir, referenceFile), "utf-8"));

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

function typeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(${value.length})`;
  return typeof value;
}

const refFlat = flatten(reference);

let hasErrors = false;

for (let i = 1; i < files.length; i++) {
  const file = files[i];
  const content = JSON.parse(readFileSync(join(localesDir, file), "utf-8"));
  const flat = flatten(content);

  const missing: string[] = [];
  const extra: string[] = [];
  const mismatches: string[] = [];

  for (const key of Object.keys(refFlat)) {
    if (!(key in flat)) {
      missing.push(key);
    } else if (typeOf(refFlat[key]) !== typeOf(flat[key])) {
      mismatches.push(`${key} (expected ${typeOf(refFlat[key])}, got ${typeOf(flat[key])})`);
    }
  }

  for (const key of Object.keys(flat)) {
    if (!(key in refFlat)) {
      extra.push(key);
    }
  }

  if (missing.length > 0 || mismatches.length > 0) {
    hasErrors = true;
    console.error(`\n❌ ${file}:`);
    if (missing.length > 0) {
      console.error(`  Missing keys (${missing.length}):`);
      for (const key of missing) {
        console.error(`    - ${key}`);
      }
    }
    if (mismatches.length > 0) {
      console.error(`  Type mismatches (${mismatches.length}):`);
      for (const m of mismatches) {
        console.error(`    - ${m}`);
      }
    }
  }

  if (extra.length > 0) {
    console.warn(`\n⚠️  ${file} (extra keys, ${extra.length}):`);
    for (const key of extra) {
      console.warn(`    - ${key}`);
    }
  }
}

if (hasErrors) {
  console.error("\nValidation failed.");
  process.exit(1);
}

console.log("\n✅ All locale files are valid.");
process.exit(0);
