import { describe, it, expect, vi } from "vitest";
import { getLocaleDisplayName, getDirection, switchLocale } from "@/lib/locale";

vi.mock("@/i18n", () => ({
  getLocaleMetadata: vi.fn((code: string) => {
    const map: Record<string, { nativeName: string; direction: "ltr" | "rtl" }> = {
      en: { nativeName: "English", direction: "ltr" },
      ru: { nativeName: "Русский", direction: "ltr" },
      ar: { nativeName: "العربية", direction: "rtl" },
    };
    return map[code];
  }),
  validateLocale: vi.fn((code: string) => ["en", "ru", "ar"].includes(code)),
}));

describe("locale", () => {
  it("returns a localized display name for known locales", () => {
    expect(getLocaleDisplayName("en", "en")).toBe("English");
    expect(getLocaleDisplayName("ru", "en")).toBe("Russian");
  });

  it("returns rtl for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
  });

  it("swaps locale in path", () => {
    expect(switchLocale("ru", "/en/stories")).toBe("/ru/stories");
  });

  it("handles root path", () => {
    expect(switchLocale("ru", "/")).toBe("/ru");
  });
});
