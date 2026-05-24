import { test as base } from './base.fixture.js';

export const test = base.extend({
  authedPage: async ({ browser, testData }, use) => {
    const ctx = await browser.newContext();

    
    await ctx.addInitScript((token) => {
      window.localStorage.setItem('auth_token', token);
    }, 'mocked-jwt-token-for-tests');
    const page = await ctx.newPage();
    await page.goto('/');
    await use(page);
    await ctx.close();
  },
});
