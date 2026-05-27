import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class ShoppingCartPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.cartSection = page.locator('section.cart, .cart-container, #cart').first();
    this.rows = page.locator('section.cart .product, .cart-item, .product-row');
    this.subtotal = page.locator('.summary .line, [class*="subtotal"], .total-price').first();
    
    
    this.checkoutBtn = page.locator('button:has-text("Checkout"), .checkout-button, [class*="checkout"]').first();
    this.emptyState = page.getByText('your cart is currently empty', { exact: false });
  }

  async addProductFromCatalog(catalogPage, index) {
    
    await catalogPage.productCards.first().waitFor({ state: 'visible', timeout: 7000 }).catch(() => {});

    
    const card = catalogPage.productCards.nth(index);
    const cardAddBtn = card.locator('.purchase-button, button:has-text("Add to cart"), [class*="purchase"]').first();
    if (await cardAddBtn.count() > 0) {
      try {
        await cardAddBtn.waitFor({ state: 'visible', timeout: 5000 });
        await cardAddBtn.click({ force: true });
        return;
      } catch (e) {
        
      }
    }

    
    try {
      await card.scrollIntoViewIfNeeded();
      await card.click({ force: true, timeout: 7000 });
    } catch (e) {
      
    }

    const purchaseBtn = this.page.locator('.purchase-button, button:has-text("Add to cart"), [class*="purchase"]').first();
    await purchaseBtn.waitFor({ state: 'visible', timeout: 8000 });
    await purchaseBtn.click({ force: true });
  }

  async openCart() {
    await this.goto('/cart');
    
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    try {
      await this.checkoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      
    }
  }

  async getRowCount() {
    return await this.rows.count();
  }

  async getRowQuantity(rowIndex) {
    const counter = this.rows.nth(rowIndex).locator('.product-counter, .quantity, input[type="number"]').first();
    await counter.waitFor({ state: 'attached', timeout: 3000 });
    
    
    const tagName = await counter.evaluate(el => el.tagName.toLowerCase());
    const txt = tagName === 'input' ? await counter.inputValue() : await counter.innerText();
    
    let cleanText = txt.replace(/[^0-9]/g, '');
    return cleanText ? Number(cleanText) : 0;
  }

  async getRowUnitPrice(rowIndex) {
    const txt = await this.rows.nth(rowIndex).locator('.price, .unit-price').first().textContent();
    let cleanText = txt.replace(/[^0-9.]/g, '');
    return cleanText ? parseFloat(cleanText) : 0.00;
  }

  async setQuantity(rowIndex, qty) {
    const row = this.rows.nth(rowIndex);
    let current = await this.getRowQuantity(rowIndex);
    
    
    for (let i = 0; i < 20; i++) {
      if (current >= qty) break;
      const plusBtn = row.locator('.operator, .plus, button:has-text("+")').filter({ hasText: '+' }).first();
      await plusBtn.click({ force: true });
      await this.page.waitForTimeout(100); 
      current = await this.getRowQuantity(rowIndex);
    }
    
    for (let i = 0; i < 20; i++) {
      if (current <= qty || current <= 0) break;
      const minusBtn = row.locator('.operator, .minus, button:has-text("-")').filter({ hasText: '-' }).first();
      await minusBtn.click({ force: true });
      await this.page.waitForTimeout(100);
      current = await this.getRowQuantity(rowIndex);
    }
  }

  async removeRow(rowIndex) {
    await this.rows.nth(rowIndex).locator('.remove-button, .delete, button:has-text("Remove")').first().click({ force: true });
  }

  async getRowPrice(rowIndex) {
    const txt = await this.rows.nth(rowIndex).locator('.product-price, .total-item-price').first().textContent();
    let cleanText = txt.replace(/[^0-9.]/g, '');
    return cleanText ? parseFloat(cleanText) : 0.00;
  }

  async getSubtotal() {
    await this.subtotal.waitFor({ state: 'attached', timeout: 3000 });
    const txt = await this.subtotal.textContent();
    let cleanText = txt.replace(/[^0-9.]/g, '');
    return cleanText ? parseFloat(cleanText) : 0.00;
  }

  async setCartItems(items) {
    await this.page.evaluate((nextItems) => {
      localStorage.setItem('cart', JSON.stringify(nextItems));
    }, items);
  }

  async getCartItems() {
    const itemsText = await this.page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    return itemsText ? JSON.parse(itemsText) : [];
  }
}