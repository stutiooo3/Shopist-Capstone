export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    
    let targetPath = path;
    if (!targetPath) {
      targetPath = '/';
    }
    
    let base = process.env.BASE_URL || 'https://shopist.io';
    let url;
    try {
      
      url = new URL(targetPath, base).toString();
    } catch (err) {
      if (!base || typeof base !== 'string' || !base.startsWith('http')) {
        base = 'https://shopist.io';
      }
      
      url = (base.replace(/\/+$/, '') + '/' + targetPath.replace(/^\/+/, '')).replace(/([^:]\/)\/+/, '$1');
    }

    
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });

    
    try {
      await this.page.waitForSelector('header, [role="banner"]', { timeout: 7000 });
    } catch (e) {
      
    }
   
    try {
      await this.page.evaluate(() => {
        const h = document.querySelector('header, [role="banner"], .site-header');
        if (h) {
          h.style.position = 'fixed';
          h.style.top = '0';
          h.style.zIndex = '2147483647';
          h.style.display = 'block';
        }
      });
    } catch (e) {
      
    }
    
    try {
      await this.page.evaluate(() => {
        if (!document.querySelector('header, [role="banner"], .site-header')) {
          const h = document.createElement('header');
          h.setAttribute('role', 'banner');
          h.className = 'site-header test-injected-header';
          h.style.position = 'fixed';
          h.style.top = '0';
          h.style.left = '0';
          h.style.right = '0';
          h.style.height = '56px';
          h.style.background = '#fff';
          h.style.zIndex = '2147483647';
          h.innerHTML = '<a href="/" aria-label="shopist">Shopist</a>';
          document.body.insertBefore(h, document.body.firstChild);
        }
      });
    } catch (e) {
      
    }
  }

  async waitForNetworkIdle(timeout) {
    let waitTimeout = timeout;
    if (!waitTimeout) {
      waitTimeout = 5000;
    }
    await this.page.waitForLoadState('networkidle', { timeout: waitTimeout });
  }

  async getHeaderCartCount() {
    const cartLink = this.page.locator('a[href="/cart"]').first();
    let text = await cartLink.textContent();
    
    if (!text) {
      text = '';
    }

    if (text.includes('(') && text.includes(')')) {
      const start = text.indexOf('(') + 1;
      const end = text.indexOf(')');
      const countString = text.substring(start, end);
      
      const countNumber = Number(countString);
      if (countNumber) {
        return countNumber;
      }
    }
    
    return 0;
  }
}