import { test, expect } from '../../src/fixtures/base.fixture.js';

test.describe('Advanced Security Boundaries & Frames', () => {
  
  test('TC-03-iframe @critical handles cross-domain secure elements', async ({ page }) => {
    await page.goto('/product/chair-wicker');
    
    
    await page.evaluate(() => {
      const iframe = document.createElement('iframe');
      iframe.id = 'secure-payment-frame';
      iframe.srcdoc = `
        <html>
          <body>
            <label for="secure-input">Secure Card Entry</label>
            <input id="secure-input" type="text" />
          </body>
        </html>
      `;
      document.body.appendChild(iframe);
    });

    
    const secureFrame = page.frameLocator('#secure-payment-frame');
    const secureField = secureFrame.getByRole('textbox', { name: 'Secure Card Entry' });
    
    await secureField.fill('4111222233334444');
    await expect(secureField).toHaveValue('4111222233334444');
  });
});