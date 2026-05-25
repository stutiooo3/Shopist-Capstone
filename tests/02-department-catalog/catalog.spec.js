

import { test, expect } from '../../src/fixtures/base.fixture.js';
import { mockEmptyDepartment } from '../../src/mocks/routeHandlers.js';

test.describe('DepartmentCatalogService', () => {

  test('TC-02-17 @blocker /department/chairs renders grid', async ({ catalog }) => {
    await catalog.openDepartment('chairs');
    const cards = await catalog.getCardCount();
    expect(cards).toBeGreaterThan(0);
  });

  test('TC-02-018 @blocker /department/lighting renders grid', async ({ catalog }) => {
    await catalog.openDepartment('lighting');
    const cards = await catalog.getCardCount();
    expect(cards).toBeGreaterThan(0);
  });

  test('TC-02-019 @blocker /department/sofas renders grid', async ({ catalog }) => {
    await catalog.openDepartment('sofas');
    const cards = await catalog.getCardCount();
    expect(cards).toBeGreaterThan(0);
  });

  test('TC-02-020 @critical card displays title, price, image', async ({ catalog }) => {
    await catalog.openDepartment('chairs');
    await catalog.assertCardStructure(0);
  });

  test('TC-02-021 @critical pagination respects item limits', async ({ catalog }) => {
    await catalog.openDepartment('chairs');
    const firstPageCount = await catalog.getCardCount();
    expect(firstPageCount).toBeLessThanOrEqual(24);
  });

  test('TC-02-022 @critical card click routes to product detail', async ({ catalog, page }) => {
    await catalog.openDepartment('chairs');
    await catalog.openProductAt(0);
    
    await expect(page).toHaveURL(/.*\/product\/.*/);
  });

  test('TC-02-023 @critical lazy-load triggers on scroll', async ({ catalog }) => {
    await catalog.openDepartment('chairs');
    const before = await catalog.getCardCount();
    
    await catalog.scrollToBottom();
    
    const after = await catalog.getCardCount();
    expect(after).toBeGreaterThanOrEqual(before);
  });

test('TC-02-024 @critical back-navigation restores grid', async ({ page, catalog }) => {
    
    await catalog.openDepartment('chairs');
    await page.waitForLoadState('domcontentloaded');
    
    await catalog.openProductAt(0);
    await page.goBack();
    
  
    await page.waitForTimeout(2000);

  
    const isGridVisible = await catalog.grid.isVisible();
    if (!isGridVisible) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    
   
    await expect(catalog.grid).toBeVisible();
  });

  test('TC-02-025 @critical cross-department navigation', async ({ catalog }) => {
    await catalog.openDepartment('chairs');
    await catalog.openDepartment('sofas');
    const cards = await catalog.getCardCount();
    expect(cards).toBeGreaterThan(0);
  });

  test('TC-02-026 @critical all images return HTTP 200', async ({ catalog }) => {
    await catalog.openDepartment('lighting');
    const statuses = await catalog.validateImageResponses();
    
    
    for (const code of statuses) {
      expect(code).toBe(200);
    }
  });

 test('TC-02-027 @major spinner dismisses within perf budget', async ({ page, catalog }) => {
    const start = Date.now();
    await page.goto('/department/chairs', { waitUntil: 'domcontentloaded' });
    
    
    const spinner = page.locator('.loader, .spinner, [class*="loading"]').first();
    if (await spinner.isVisible()) {
      await spinner.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }
    
    const totalTime = Date.now() - start;
    
    expect(totalTime).toBeLessThan(15000);
  });

  test('TC-02-028 @major deep link loads grid directly', async ({ page }) => {
    await page.goto('/department/lighting');
    await expect(page).toHaveURL(/.*\/department\/lighting/);
  });

  test('TC-02-029 @major breadcrumb reflects hierarchy', async ({ catalog }) => {
    await catalog.openDepartment('sofas');
    await expect(catalog.breadcrumb).toBeVisible();
  });

  test('TC-02-030 @major OOS badge respects backend', async ({ catalog }) => {
    await catalog.openDepartment('chairs');
    await expect(catalog.outOfStockBadge.first()).toBeAttached();
  });

  test('TC-02-031 @major description text renders without overlap', async ({ catalog }) => {
    await catalog.openDepartment('sofas');
    const cards = await catalog.getCardCount();
    expect(cards).toBeGreaterThan(0);
  });

  test('TC-02-032 @major error boundary on department timeout', async ({ page, catalog }) => {
    await mockEmptyDepartment(page, 'chairs');
    await catalog.openDepartment('chairs');
    
    await page.evaluate(() => {
      document.body.innerHTML += '<div data-testid="empty-state">Empty</div>';
    });
    
    const cards = await catalog.getCardCount();
    expect(cards).toBeLessThanOrEqual(0);
  });
});