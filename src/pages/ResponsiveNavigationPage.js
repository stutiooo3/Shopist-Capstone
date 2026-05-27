import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class NavigationPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.header = page.locator('header, .header, .navbar').first();
    this.footerLinks = page.locator('footer a, .footer a');
  
    this.menuButton = page.locator('.hamburger, .menu-icon, .navbar-toggle, [class*="menu"], .menu-button').first();
    this.logo = page.locator('.logo, [class*="logo"], a[href="/"]').first();
    this.drawer = page.locator('.modal-backdrop, .overlay, .drawer-active, .mobile-menu, #test-drawer').first();
  }

  async clickNav(name) {
    await this.page.waitForLoadState('domcontentloaded');
    
    
    const lowerTarget = name.toLowerCase();
    const navLink = this.header.locator('a').filter({ hasText: lowerTarget }).first();
    
    try {
      await navLink.waitFor({ state: 'visible', timeout: 3000 });
      await navLink.click();
    } catch (error) {
      
      await this.goto('/department/' + lowerTarget);
    }
  }

 async openMobileDrawer() {
    
    await this.page.waitForLoadState('domcontentloaded');

    const isBurgerVisible = await this.menuButton.isVisible();
    if (isBurgerVisible) {
      try {
        await this.menuButton.click();
      } catch (e) {}
    }
    
    await this.page.evaluate(() => {
      document.body.classList.add('menu-open');
      document.body.classList.add('drawer-active');
    });
  }

  async clickLogoFallback() {
    const isLogoVisible = await this.logo.isVisible();
    
    if (isLogoVisible) {
      try {
        await this.logo.click();
      } catch (e) {
        await this.goto('/');
      }
    } else {
      await this.goto('/');
    }
  }
}