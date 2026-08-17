import { test, expect } from "@playwright/test";

test.describe("App", () => {
  test("home loads", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("header")).toBeVisible();
  });

  test("locale switcher is visible", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByLabel("Language switcher")).toBeVisible();
    await expect(page.getByText("EN")).toBeVisible();
    await expect(page.getByText("RU")).toBeVisible();
  });

  test("/en/stories loads", async ({ page }) => {
    await page.goto("/en/stories");
    await expect(page.getByText("Stories")).toBeVisible();
  });

  test("/en/tales/[slug] loads", async ({ page }) => {
    await page.goto("/en/tales/test-slug");
    await expect(page.getByText("Tale")).toBeVisible();
  });

  test("/en/videos loads", async ({ page }) => {
    await page.goto("/en/videos");
    await expect(page.getByText("Videos")).toBeVisible();
  });

  test("/en/channels loads", async ({ page }) => {
    await page.goto("/en/channels");
    await expect(page.getByText("Channels")).toBeVisible();
  });

  test("mobile viewport renders", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en");
    await expect(page.locator("header")).toBeVisible();
  });
});
