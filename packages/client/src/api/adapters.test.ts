import { describe, it, expect } from "vitest";
import {
  selectTaleTitle,
  formatDuration,
  formatPublishedDate,
  getYouTubeWatchUrl,
  getYouTubeEmbedUrl,
  getChannelUrl,
} from "@/api/adapters";
import type { TaleDetail, Translation } from "@fairy-tales/shared";

describe("adapters", () => {
  const translations: Translation[] = [
    { id: "1", fairyTaleId: "t1", language: "en", title: "English Title" },
    { id: "2", fairyTaleId: "t1", language: "ru", title: "Русское название" },
  ];

  const tale: TaleDetail = {
    id: "t1",
    slug: "tale-slug",
    canonicalTitle: "Canonical Title",
    thumbnailUrl: "https://example.com/thumb.jpg",
    translations,
  };

  it("returns translation when matching locale", () => {
    expect(selectTaleTitle(tale, "en")).toBe("English Title");
  });

  it("falls back to canonicalTitle", () => {
    expect(selectTaleTitle(tale, "fr")).toBe("Canonical Title");
  });

  it("returns Unknown duration for null", () => {
    expect(formatDuration(null)).toBe("Unknown duration");
  });

  it("formats minutes correctly", () => {
    expect(formatDuration(125)).toBe("2");
  });

  it("returns localized date", () => {
    expect(formatPublishedDate("2024-01-15", "en-US")).toBe("Jan 15, 2024");
  });

  it("returns correct YouTube URL", () => {
    expect(getYouTubeWatchUrl("abc123")).toBe("https://www.youtube.com/watch?v=abc123");
  });

  it("returns a privacy-enhanced YouTube embed URL", () => {
    expect(getYouTubeEmbedUrl("abc 123")).toBe(
      "https://www.youtube-nocookie.com/embed/abc%20123?rel=0",
    );
  });

  it("returns null for null handle", () => {
    expect(getChannelUrl(null)).toBeNull();
  });

  it("returns correct URL for handle", () => {
    expect(getChannelUrl("some-channel")).toBe("https://www.youtube.com/@some-channel");
  });
});
