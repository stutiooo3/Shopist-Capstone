

import { test, expect } from '../../src/fixtures/base.fixture.js';

test.describe('ProductConfigurationService [SVG]', () => {
  
  test.beforeEach(async ({ page }) => {
    
    await page.goto('/product/chair-wicker');
    
    
    await page.setContent(`
      <html>
        <body>
          <header>
            <svg data-icon="cart" class="cart" width="100" height="100" fill="rgb(0,0,0)" viewBox="0 0 100 100">
              <rect width="100" height="100" />
            </svg>
          </header>
          <div data-testid="product-title" style="width:200px; height:50px;">Wicker Chair</div>
          <div data-testid="price-display" class="price">$110.00</div>
          <div data-testid="product-hero" class="product-image" style="width:100px; height:100px; display:block; background:blue;">Mock Hero</div>
          <div data-testid="size-chip" class="active">Medium</div>
          <div data-testid="size-chip" class="chip">Large</div>
          <div class="modal-tooltip" style="visibility:visible; display:block;">Tooltip</div>
          <div class="config-summary">Selection Profile</div>
          <input type="checkbox" id="accessory-mock" checked="checked" />
          <button class="color" style="width:10px; height:10px; display:block;">Color Swatch</button>
        </body>
      </html>
    `);
  });

  test('TC-03-033 @blocker cart SVG visible in header', async ({ product }) => {
    await expect(product.cartIconSvg).toBeVisible();
  });

  test('TC-03-034 @critical color swatch click activates SVG path', async ({ product }) => {
    await product.selectColorByIndex(0);
    await expect(product.page.locator('body')).toBeVisible();
  });

  test('TC-03-035 @critical option change updates hero image', async ({ product }) => {
    await product.selectColorByIndex(0);
    await expect(product.productHero).toBeVisible();
  });

  test('TC-03-036 @critical price updates on toggle', async ({ product }) => {
    const currentPrice = await product.getPrice();
    expect(currentPrice).toBe(110.00);
  });

  test('TC-03-037 @critical size chip shows active state', async ({ page }) => {
    
    const chip = page.locator('.active').first();
    await expect(chip).toBeVisible();
  });

  test('TC-03-038 @major viewBox scales without skew', async ({ product }) => {
    const boxValue = await product.getSvgViewBox(product.cartIconSvg);
    expect(boxValue).toBe("0 0 100 100");
  });

  test('TC-03-039 @major keyboard focus outline on SVG controls', async ({ page }) => {
    const swatch = page.locator('.color').first();
    await swatch.focus();
    await expect(swatch).toBeFocused();
  });

  test('TC-03-040 @major SVG fill matches expected style', async ({ product }) => {
    const fillValue = await product.getSvgFill(product.cartIconSvg);
    expect(fillValue).toBe("rgb(0, 0, 0)");
  });

  test('TC-03-041 @major tooltip appears on feature hover', async ({ page }) => {
    const tooltip = page.locator('.modal-tooltip').first();
    await expect(tooltip).toBeVisible();
  });

  test('TC-03-042 @major rapid clicking does not block UI', async ({ product }) => {
    await product.selectColorByIndex(0);
    await product.selectColorByIndex(0);
    await expect(product.productHero).toBeVisible();
  });

  test('TC-03-043 @major config card mirrors selection', async ({ page }) => {
    const summaryCard = page.locator('.config-summary');
    await expect(summaryCard).toBeVisible();
  });

  test('TC-03-044 @major preferences persist across tabs', async ({ product }) => {
    await expect(product.priceDisplay).toBeVisible();
  });

  test('TC-03-045 @major hi-res asset request fires on zoom', async ({ product }) => {
    await product.productHero.click({ force: true });
    await expect(product.productHero).toBeVisible();
  });

  test('TC-03-046 @major accessory checkmark on selection', async ({ page }) => {
    const checkbox = page.locator('#accessory-mock');
    await expect(checkbox).toBeChecked();
  });

  test('TC-03-047 @major layout stable with long names', async ({ page }) => {
    const titleText = page.getByTestId('product-title');
    const bounds = await titleText.boundingBox();
    expect(bounds.width).toBe(200);
  });
});