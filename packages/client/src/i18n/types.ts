export interface LocaleMetadata {
  code: string;
  nativeName: string;
  direction: "ltr" | "rtl";
}

export type LocaleResource = Record<string, unknown>;
