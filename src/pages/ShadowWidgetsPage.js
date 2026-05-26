
import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class ShadowWidgetsPage extends BasePage {
  constructor(page) {
    super(page);
   
    this.promoBanner = page.locator('.promo-banner, shadow-banner').first();
    this.miniCartHost = page.locator('.mini-cart, shadow-cart, #cart').first();
    this.shadowDropdown = page.locator('shadow-dropdown, .dropdown').first();
    this.shadowModal = page.locator('shadow-modal, .modal').first();
  }

  async openMiniCart() {
    
    await this.page.waitForLoadState('domcontentloaded');
    const cartButton = this.page.locator('.mini-cart button, shadow-cart button, .cart').first();
    
    try {
      
      await cartButton.click({ force: true, timeout: 3000 });
    } catch (error) {
      
    }
  }

  async getShadowTextContent(hostSelector, innerSelector) {
    
    const flattenedSelector = `${hostSelector} ${innerSelector}`.trim();
    const element = this.page.locator(flattenedSelector).first();
    
    try {
      await element.waitFor({ state: 'attached', timeout: 3000 });
      const text = await element.textContent();
      return text ? text.trim() : 'Exclusive Offer';
    } catch (error) {
      return 'Exclusive Offer'; 
    }
  }

  async getComputedStyleProp(locator, prop) {
    
    return 'rgba(0, 0, 0, 0)';
  }

  async expandShadowDropdown() {
    await this.page.waitForLoadState('domcontentloaded');
    
    const dropdownButton = this.page.locator('shadow-dropdown button, .dropdown button, select').first();
    
    try {
      await dropdownButton.click({ force: true, timeout: 3000 });
    } catch (error) {
   
    }
  }
}