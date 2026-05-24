import { test as base, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage.js';
import { ProfileSessionPage } from '../pages/ProfileSessionPage.js';
import { DepartmentCatalogPage } from '../pages/DepartmentCatalogPage.js';
import { ProductConfigurationPage } from '../pages/ProductConfigurationPage.js';
import { ShadowWidgetsPage } from '../pages/ShadowWidgetsPage.js';
import { ShoppingCartPage } from '../pages/ShoppingCartPage.js';
import { CheckoutFormPage } from '../pages/CheckoutFormPage.js';
import { NavigationPage } from '../pages/ResponsiveNavigationPage.js'; 

// Importing testing data objects
import { DataFactory } from '../utils/DataFactory.js';

export const test = base.extend({
  

  nav: async ({ page }, use) => {
    const navigationPageInstance = new NavigationPage(page);
    await use(navigationPageInstance);
  },

  profile: async ({ page }, use) => {
    const profilePageInstance = new ProfileSessionPage(page);
    await use(profilePageInstance);
  },

  catalog: async ({ page }, use) => {
    const catalogPageInstance = new DepartmentCatalogPage(page);
    await use(catalogPageInstance);
  },

  product: async ({ page }, use) => {
    const productPageInstance = new ProductConfigurationPage(page);
    await use(productPageInstance);
  },

  shadow: async ({ page }, use) => {
    const shadowPageInstance = new ShadowWidgetsPage(page);
    await use(shadowPageInstance);
  },

  cart: async ({ page }, use) => {
    const cartPageInstance = new ShoppingCartPage(page);
    await use(cartPageInstance);
  },

  checkout: async ({ page }, use) => {
    const checkoutPageInstance = new CheckoutFormPage(page);
    await use(checkoutPageInstance);
  },

  invoice: async ({ page }, use) => {
    const invoicePageInstance = new CheckoutFormPage(page);
    await use(invoicePageInstance);
  },

  //  mock database user profiles 
  testData: async ({}, use) => {
    const staticDataProfile = {
      validUser: {
        username: 'qa.user@shopist.io',
        password: 'Sh0pist!Test'
      },
      security: {
        sqlInjection: "' OR '1'='1",
        xssPayload: "<script>alert('xss')</script>",
        specialChars: "!@#$%^&*()_+"
      }
    };
    await use(staticDataProfile);
  }
});

export { expect };