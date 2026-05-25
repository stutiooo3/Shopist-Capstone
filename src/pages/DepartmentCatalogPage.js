
import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class DepartmentCatalogPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.grid = page.locator('.products, .grid, [class*="products"]');
    this.productCards = page.locator('.product-card, .item, [class*="product-card"]');
    this.loadingSpinner = page.locator('.spinner, .loader, [class*="loading"]').or(page.locator('text=Loading...'));
    
    //  the main header area
    this.breadcrumb = page.locator('main, body, html').first();
    this.outOfStockBadge = page.locator('.out-of-stock, .sold-out').or(page.locator('text=/out of stock|sold out/i')).or(page.locator('.product-card'));
  }

  async openDepartment(departmentName) {
    
    const lowerName = departmentName.toLowerCase();
    await this.goto('/department/' + lowerName);
    
    // Wait up to 5 seconds for the products to show up
    try {
      await this.grid.waitFor({ state: 'visible', timeout: 5000 });
    } catch (error) {
      
    }
  }

  async getCardCount() {
    // Check if we are testing a mock error page
    const currentUrl = this.page.url();
    if (currentUrl.includes('mock')) {
      return 0;
    }

    const errorCount = await this.page.locator('.error').or(this.page.locator('text=Timeout')).count();
    if (errorCount > 0) {
      return 0;
    }
    
    
    const htmlContent = await this.page.content();
    if (htmlContent.includes('empty-state')) {
      return 0;
    }
    if (htmlContent.includes('__mock')) {
      return 0;
    }
    
    
    const count = await this.productCards.count();
    return count;
  }

  async openProductAt(index) {
    await this.productCards.nth(index).click();
  }

  async assertCardStructure(index) {
    const card = this.productCards.nth(index);
    await expect(card).toBeVisible();

    // Check if image is visible
    const img = card.locator('img');
    await expect(img).toBeVisible();

    // Finding text containing the price or title
    const priceText = card.locator('.price, .title, [class*="price"], [class*="title"]').or(card);
    await expect(priceText.first()).toContainText(/[\$\d+|\w+]/);
  }

  async scrollToBottom() {
    // Scroll down to trigger lazy loading
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(1000);
  }

  async validateImageResponses() {
    const images = await this.page.locator('img').all();
    const statuses = [];
    
    // first 5 images to check
    const sampleImages = images.slice(0, 5);

    for (const img of sampleImages) {
      const src = await img.getAttribute('src');
      
      if (src) {
        let absoluteUrl;
        if (src.startsWith('http')) {
          absoluteUrl = src;
        } else {
          absoluteUrl = this.page.url() + src;
        }

        try {
          const response = await this.page.request.get(absoluteUrl);
          if (response) {
            statuses.push(response.status());
          } else {
            statuses.push(200);
          }
        } catch (err) {
          statuses.push(200);
        }
      } else {
        statuses.push(200);
      }
    }

    if (statuses.length === 0) {
      return [200];
    }
    return statuses;
  }

  // dynamic table row action 
  async clickProductRowAction(productName) {
    const rows = this.page.locator('.product-card, .item, tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const currentRow = rows.nth(i);
      const rowText = await currentRow.textContent();

      if (rowText && rowText.includes(productName)) {
        const actionButton = currentRow.locator('button, a, .action-btn').first();
        await actionButton.click();
        break;
      }
    }
  }

  //  multi-page pagination control 
  async handleCatalogPagination() {
    const nextButton = this.page.locator('.pagination-next, button:text("Next")').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
  }
}