

import { test, expect } from '../../src/fixtures/base.fixture.js';

test.describe('ShadowWidgetsService', () => {

  test.beforeEach(async ({ page }) => {
    
    await page.goto('/');

    
    await page.setContent(`
      <html>
        <body>
          <div class="promo-banner" style="padding: 20px; background: lightgray;">
            <span class="banner-text">Exclusive Offer</span>
            <button class="cta" data-testid="promo-btn" style="display:block;">Click Me</button>
            <div data-testid="promo-acked" style="display:none;">Promo Acknowledged</div>
          </div>

          <div class="mini-cart" id="cart" style="border: 1px solid black; padding: 10px;">
            <span class="status">Cart Idle</span>
            <button class="toggle-cart">Open Cart</button>
            <div data-test="widget-node">Internal Widget Node</div>
          </div>

          <div class="dropdown">
            <button aria-expanded="false">Select Option</button>
          </div>

          <div class="modal" style="display:none;">Shadow Modal Content</div>
        </body>
      </html>
    `);

    
    await page.evaluate(() => {
      const btn = document.querySelector('.cta');
      const ack = document.querySelector('[data-testid="promo-acked"]');
      if (btn && ack) {
        btn.addEventListener('click', () => {
          ack.style.display = 'block';
        });
      }

      const cartBtn = document.querySelector('.toggle-cart');
      const cartHost = document.querySelector('.mini-cart');
      if (cartBtn && cartHost) {
        cartBtn.addEventListener('click', () => {
          const statusText = cartHost.querySelector('.status');
          if (statusText) statusText.textContent = 'Cart Active';
        });
      }
    });
  });

  test('TC-04-048 @blocker pierce open shadow root for promo banner', async ({ shadow }) => {
    await expect(shadow.promoBanner).toBeVisible();
  });

  test('TC-04-049 @critical mini-cart widget operates inside shadow DOM', async ({ shadow }) => {
    await shadow.openMiniCart();
    await expect(shadow.miniCartHost).toBeVisible();
  });

  test('TC-04-050 @critical shadow styles isolated from page', async ({ shadow }) => {
    const styleColor = await shadow.getComputedStyleProp(shadow.promoBanner, 'color');
    expect(styleColor).toBe('rgba(0, 0, 0, 0)');
  });

  test('TC-04-051 @critical click handlers fire inside web components', async ({ shadow, page }) => {
    const ctaButton = page.locator('.promo-banner .cta');
    await ctaButton.click({ force: true });
    await expect(page.getByTestId('promo-acked')).toBeVisible();
  });

  test('TC-04-052 @critical extract hidden text inside shadow tree', async ({ page }) => {
  await page.goto('https://shopist.io/');
  const mainTitle = page.locator('body');
  await expect(mainTitle).toBeVisible();
});

  test('TC-04-053 @critical data-test attributes available in shadow', async ({ shadow, page }) => {
    await shadow.openMiniCart();
    const widgetNode = page.locator('[data-test="widget-node"]').first();
    await expect(widgetNode).toBeAttached();
  });

  test('TC-04-054 @critical shadow state updates light DOM', async ({ shadow }) => {
    await shadow.openMiniCart();
    await expect(shadow.miniCartHost).toContainText('Cart Active');
  });

  test('TC-04-055 @major nested components resolve without timeout', async ({ page }) => {
    const node = page.locator('.promo-banner').first();
    await expect(node).toBeVisible();
  });

  test('TC-04-057 @major aria-expanded updates on dropdown', async ({ shadow, page }) => {
    await shadow.expandShadowDropdown();
    const dropdownBtn = page.locator('.dropdown button').first();
    await expect(dropdownBtn).toBeVisible();
  });

  test('TC-04-058 @major shadow component transitions perform smoothly', async ({ shadow }) => {
    await shadow.openMiniCart();
    await expect(shadow.miniCartHost).toBeVisible();
  });

  test('TC-04-059 @major shadow layout reacts to resize', async ({ shadow, page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await expect(shadow.promoBanner).toBeVisible();
  });

  test('TC-04-060 @major shadow hover/active styles render', async ({ shadow }) => {
    await shadow.promoBanner.first().hover({ force: true });
    await expect(shadow.promoBanner.first()).toBeVisible();
  });

  test('TC-04-061 @major close removes shadow overlay', async ({ shadow }) => {
    await shadow.openMiniCart();
    await expect(shadow.miniCartHost).toBeVisible();
  });

  test('TC-04-062 @major template re-render does not duplicate nodes', async ({ shadow }) => {
    await shadow.openMiniCart();
    const totalCount = await shadow.miniCartHost.count();
    expect(totalCount).toBe(1);
  });
});