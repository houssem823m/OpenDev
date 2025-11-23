import { test, expect } from "@playwright/test";

test.describe("Admin - Create Service", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");
    // TODO: Add login steps when auth is implemented
    // For now, skip if not authenticated
    test.skip();
  });

  test("should create a new service", async ({ page }) => {
    await page.goto("/admin/services/add");

    // Fill form
    await page.fill('input[name="title"]', "Test Service");
    await page.fill('input[name="slug"]', "test-service");
    await page.fill('textarea[name="description"]', "This is a test service");

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page).toHaveURL("/admin/services");
    await expect(page.locator("text=Test Service")).toBeVisible();
  });
});

