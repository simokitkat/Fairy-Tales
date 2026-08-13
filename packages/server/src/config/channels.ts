export const CHANNELS = [
  { handle: "@EnglishFairyTales", language: "en" },
  { handle: "@RussianFairyTales", language: "ru" },
] as const;

export type ChannelConfig = (typeof CHANNELS)[number];
