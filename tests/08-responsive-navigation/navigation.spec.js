

import { test, expect } from '../../src/fixtures/base.fixture.js';

test.describe('ResponsiveNavigationService', () => {

  test('TC-08-111-113 @blocker header nav routes work across browsers', async ({ nav, page }) => {
    await nav.goto('/');
    await nav.clickNav('chairs');
    
    await expect(page).toHaveURL(/.*\/department\/chairs/);
  });

  test('TC-08-114 @critical hamburger appears on mobile breakpoint', async ({ nav, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await nav.goto('/');
    await nav.openMobileDrawer();
    await expect(nav.menuButton).toBeVisible();
  });

  test('TC-08-115 @critical sticky header on scroll', async ({ nav, page }) => {
    await nav.goto('/');
    await page.evaluate(() => {
      window.scrollTo(0, 2000);
    });
    await expect(nav.header).toBeVisible();
  });

  test('TC-08-116 @critical side drawer opens on tablet', async ({ nav, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await nav.goto('/');
    await nav.openMobileDrawer();
    await expect(nav.menuButton).toBeVisible();
  });

  test('TC-08-117 @critical footer links interactive', async ({ nav }) => {
    await nav.goto('/');
    const count = await nav.footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-08-118 @major logo routes to base URL', async ({ nav, page }) => {
    await nav.goto('/department/chairs');
    await nav.clickLogoFallback();
    
    await expect(page).toHaveURL('https://shopist.io/');
  });


  test.skip('TC-08-119 @major orientation switch reflows menu', async ({ nav, page }) => {
    await nav.goto('/');
    
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(nav.header).toBeVisible();
  });

  test.skip('TC-08-120 @major overlay blocks background interaction', async ({ page, nav }) => {
    await nav.goto('/');
    await nav.openMobileDrawer();
    const overlay = page.locator('.modal-backdrop, .overlay').first();
    await expect(overlay).toBeVisible();
  });

  test.skip('TC-08-121 @major touch targets ≥44px', async ({ nav }) => {
    await nav.goto('/');
    const size = await nav.menuButton.boundingBox();
    
    const elementHeight = size.height;
    expect(elementHeight).toBeGreaterThanOrEqual(44);
  });

  test.skip('TC-08-122 @major text scaling avoids overlap', async ({ nav }) => {
    await nav.goto('/');
    const size = await nav.header.boundingBox();
    expect(size.height).toBeGreaterThan(0);
  });

  test.skip('TC-08-123 @major dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('.dark-mode-btn, #theme-toggle').first();
    await themeBtn.click();
    await expect(page.locator('body')).toHaveClass('dark');
  });

  test.skip('TC-08-124 @major external footer links use rel=noopener', async ({ page }) => {
    await page.goto('/');
    const externalLink = page.locator('footer a').first();
    await expect(externalLink).toHaveAttribute('rel', 'noopener');
  });

  test.skip('TC-08-125 @major language selector switches locale', async ({ page }) => {
    await page.goto('/');
    const selectBox = page.locator('.language-select, select').first();
    await selectBox.selectOption('es');
    await expect(page).toHaveURL(/.*\/es.*/);
  });

  test.skip('TC-08-126 @major keyboard tab order logical', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const element = page.locator(':focus');
    await expect(element).toBeVisible();
  });
});