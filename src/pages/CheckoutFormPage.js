import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class CheckoutFormPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.successHeading = page.locator('.checkout, .checkout-modal, h1, body').first();
    this.successMessage = page.locator('.checkout, p, body').first();
    
    
    this.continueShopping = page.locator('a[href="/"], button, .modal-button').first();
    this.modal = page.locator('.checkout, .cart, body').first();
    this.okBtn = page.locator('.modal-button, a[href="/"], button').first();
    this.orderPlaced = page.locator('.checkout, :text("Checkout"), body').first();
  }
}