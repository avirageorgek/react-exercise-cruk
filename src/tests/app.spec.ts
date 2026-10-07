import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("HomePage tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("can view homepage correctly without and accessibility errors", async ({
    page,
  }) => {
    await expect(page.locator('h1:has-text("React Exercise")')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("main")
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("cannot submit form with keywords less than 2 characters", async ({
    page,
  }) => {
    await page.getByLabel("Keywords").fill("a");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
      page.getByText("keywords must have at least 2 characters."),
    ).toBeVisible();
  });

  test("cannot submit form with keywords more than 50 characters", async ({
    page,
  }) => {
    await page.getByLabel("Keywords").fill("a".repeat(51));
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
      page.getByText("keywords must have at most 50 characters."),
    ).toBeVisible();
  });

  test("cannot submit form with year start less than 1900", async ({
    page,
  }) => {
    await page.getByLabel("Year start").fill("1899");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
      page.getByText("Year start must be after 1900."),
    ).toBeVisible();
  });

  test("cannot submit form with year start in the future", async ({ page }) => {
    const nextYear = new Date().getFullYear() + 1;
    await page.getByLabel("Year start").fill(nextYear.toString());
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
      page.getByText("Year start must not be in the future."),
    ).toBeVisible();
  });

  test("cannot submit form with year start as non-numeric", async ({
    page,
  }) => {
    await page.getByLabel("Year start").fill("abcd");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Please enter a valid number.")).toBeVisible();
  });

  test("cannot submit form with media type not selected", async ({ page }) => {
    await page.getByLabel("Media type").selectOption("");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Please select a media type.")).toBeVisible();
  });

  test("can submit form with valid inputs", async ({ page }) => {
    await page.getByLabel("Keywords").fill("moon");
    await page.getByLabel("Media type").selectOption("image");
    await page.getByLabel("Year start").fill("2000");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
      page.getByText("keywords must have at least 2 characters."),
    ).not.toBeVisible();
    await expect(
      page.getByText("keywords must have at most 50 characters."),
    ).not.toBeVisible();
    await expect(
      page.getByText("Year start must be after 1900."),
    ).not.toBeVisible();
    await expect(
      page.getByText("Year start must not be in the future."),
    ).not.toBeVisible();
    await expect(
      page.getByText("Please enter a valid number."),
    ).not.toBeVisible();
    await expect(
      page.getByText("Please select a media type."),
    ).not.toBeVisible();
  });
});
