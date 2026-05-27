import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class FulfillmentInvoicePage extends BasePage {
  constructor(page) {
    super(page);
    this.modal = page.getByText(/thank you/i);
    this.orderPlaced = page.getByText(/your order has been placed|order has been placed|order received/i);
    this.okBtn = page.getByRole('link', { name: /continue shopping/i });
    this.cancelText = page.getByText(/cancel/i);
  }

  async expectMaskedCard() {
    await expect(this.orderPlaced).toBeVisible();
  }
}
