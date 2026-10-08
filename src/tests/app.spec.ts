import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { NasaResponse } from "../types";
import { NASA_API_URL } from "../services/nasa";
import {
  searchImageResults,
  searchVideoResults,
  NASA_ASSETS_URL,
  searchAudioResults,
  emptySearchResult,
} from "./fixtures/nasaSearch";

const emptySearchResponse: NasaResponse = {
  collection: { version: "1.0", href: "", items: [] },
};

test.describe("HomePage tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${NASA_ASSETS_URL}/**`, (route) => {
      route.abort();
    });
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

  test("can submit form with valid inputs and see results", async ({
    page,
  }) => {
    await page.getByLabel("Keywords").fill("moon");
    await page.getByLabel("Media type").selectOption("image");
    await page.getByLabel("Year start").fill("2000");
    await page.route(`${NASA_API_URL}*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(emptySearchResponse),
      });
    });
    const requestPromise = page.waitForRequest(`${NASA_API_URL}*`);
    await page.getByRole("button", { name: "Submit" }).click();
    const request = await requestPromise;
    const requestUrl = new URL(request.url());
    expect(requestUrl.searchParams.get("keywords")).toBe("moon");
    expect(requestUrl.searchParams.get("media_type")).toBe("image");
    expect(requestUrl.searchParams.get("year_start")).toBe("2000");
  });

  test("shows search results for image search", async ({ page }) => {
    await page.route(`${NASA_API_URL}*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(searchImageResults),
      });
    });
    await page.getByLabel("Keywords").fill("moon");
    await page.getByLabel("Media type").selectOption("image");
    await page.getByLabel("Year start").fill("2000");
    await page.getByRole("button", { name: "Submit" }).click();
    const results = page.getByRole("main").getByRole("listitem");
    await expect(results).toHaveCount(2);
    await expect(
      page.getByRole("heading", { name: "Apollo 11 footprint" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Apollo 13 footprint" }),
    ).toBeVisible();
  });

  test("shows search results for video search", async ({ page }) => {
    await page.route(`${NASA_API_URL}*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(searchVideoResults),
      });
    });

    await page.getByLabel("Keywords").fill("moon");
    await page.getByLabel("Media type").selectOption("video");
    await page.getByRole("button", { name: "Submit" }).click();
    const result = page.getByRole("main").getByRole("listitem");

    await expect(result).toHaveCount(2);
    await expect(
      page.getByRole("heading", { name: "Apollo 11 video footprint" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Apollo 13 video footprint" }),
    ).toBeVisible();
  });

  test("shows search results for audio search", async ({ page }) => {
    await page.route(`${NASA_API_URL}*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(searchAudioResults),
      });
    });

    await page.getByLabel("Keywords").fill("moon");
    await page.getByLabel("Media type").selectOption("audio");
    await page.getByRole("button", { name: "Submit" }).click();
    const result = page.getByRole("main").getByRole("listitem");

    await expect(result).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Apollo 13 audio footprint" }),
    ).toBeVisible();
  });

  test("shows a message when there are no results", async ({ page }) => {
    await page.route(`${NASA_API_URL}*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(emptySearchResult),
      });
    });
    await page.getByLabel("Keywords").fill("gdfgsdjgfjgdsfgds");
    await page.getByLabel("Media type").selectOption("image");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("No results found")).toBeVisible();
  });

  test("shows a modal when user click on a list item", async ({ page }) => {
    await page.route(`${NASA_API_URL}*`, (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(searchImageResults),
      });
    });
    await page.getByLabel("Keywords").fill("moon");
    await page.getByLabel("Media type").selectOption("image");
    await page.getByLabel("Year start").fill("2000");
    await page.getByRole("button", { name: "Submit" }).click();
    const results = page.getByRole("main").getByRole("listitem");
    await expect(results).toHaveCount(2);
    await page.getByRole("button", { name: "Apollo 11 footprint" }).click()

    const modal = page.getByRole("dialog", { name: "Apollo 11 footprint" })
    await expect(modal).toBeVisible()
  });
});
