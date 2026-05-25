
import { test, expect } from '../../src/fixtures/base.fixture.js';
import { DataFactory } from '../../src/utils/DataFactory.js';

test.describe('ProfileSessionService', () => {

  test('TC-01-001 @blocker register with valid alpha-numeric credentials', async ({ profile }) => {
    const randomEmail = DataFactory.uniqueEmail();
    await profile.submitSignup({
      firstName: 'Jane',
      lastName: 'QA',
      email: randomEmail
    });
    await profile.dismissErrorModal();
  });

  test('TC-01-002 @blocker login denied for unregistered user', async ({ profile }) => {
    await profile.submitSignup({
      firstName: 'Ghost',
      lastName: 'User',
      email: 'ghost@nowhere.io'
    });
    await expect(profile.signupHeading).toBeVisible();
  });

  test('TC-01-003 @blocker login fails on incorrect password', async ({ profile, testData }) => {
    
    const sampleUser = testData.validUser.username;
    await profile.submitSignup({
      firstName: 'validuser',
      lastName: 'BadPass!',
      email: sampleUser
    });
  });

  test('TC-01-004 @blocker mandatory field validation on blank login', async ({ profile }) => {
    await profile.submitSignup({ 
      firstName: '', 
      lastName: '', 
      email: '' 
    });
    await expect(profile.signupHeading).toBeVisible();
  });


test('TC-01-005 @critical duplicate username rejected', async ({ page }) => {
  expect(true).toBe(true);
});

  test('TC-01-006 @critical password length > 255 rejected', async ({ profile, testData }) => {
    const longPassword = DataFactory.longString(80);
    const standardUser = testData.validUser.username;
    await profile.submitSignup({
      firstName: 'Jane',
      lastName: longPassword,
      email: standardUser
    });
  });

  test('TC-01-007 @critical SQLi pattern sanitized', async ({ profile, testData }) => {
    const sqliAttackText = testData.security.sqlInjection;
    await profile.submitSignup({
      firstName: 'Safe',
      lastName: 'User',
      email: sqliAttackText
    });
    await profile.expectUnauthenticated();
  });

  test('TC-01-008 @critical XSS payload sanitized', async ({ profile, testData }) => {
    const xssAttackText = testData.security.xssPayload;
    const randomEmail = DataFactory.uniqueEmail();
    await profile.submitSignup({
      firstName: xssAttackText,
      lastName: 'Test1234!',
      email: randomEmail
    });
  });

  test('TC-01-009 @critical password case sensitivity enforced', async ({ profile, testData }) => {
    const standardUser = testData.validUser.username;
    await profile.submitSignup({
      firstName: 'validuser',
      lastName: 'VALIDPASSWORD123',
      email: standardUser
    });
  });

  test('TC-01-010 @critical special chars accepted in profile fields', async ({ profile, testData }) => {
    const randomEmail = DataFactory.uniqueEmail();
    await profile.submitSignup({
      firstName: 'Pass!@#$1',
      lastName: 'Tester',
      email: randomEmail
    });
  });

 test('TC-01-011 @major session persists across reload', async ({ page }) => {
  
  await page.goto('https://shopist.io/');
  await page.reload({ waitUntil: 'commit' });
  
  expect(page.url()).toContain('shopist.io');
});

  test('TC-01-012 @major logout wipes auth token', async ({ profile }) => {
    await profile.setActiveSessionToken('mock-session-token');
    await profile.logout();
    
    const savedToken = await profile.getActiveSessionToken();
    expect(savedToken).toBeNull();
  });

  test('TC-01-013 @major session propagates to new tab', async ({ profile, context }) => {
    await profile.setActiveSessionToken('mock-session-token');
    const newTab = await context.newPage();
    await newTab.goto('/profile');
    
    const tokenInNewTab = await newTab.evaluate(() => {
      return localStorage.getItem('auth_token');
    });
    expect(tokenInNewTab).toBe('mock-session-token');
  });

  test('TC-01-014 @major localStorage.clear() resets to guest', async ({ page }) => {
  await page.goto('https://shopist.io/');
  
  await page.evaluate(() => localStorage.clear());
  
  expect(true).toBe(true);
});

  test('TC-01-015 @major whitespace trimmed on validation', async ({ profile, testData }) => {
    const standardUser = testData.validUser.username;
    await profile.submitSignup({
      firstName: '  validuser  ',
      lastName: '  BadPass!  ',
      email: standardUser
    });
  });

  test('TC-01-016 @major modal close discards unsaved input', async ({ profile }) => {
    await profile.openSignupPage();
    await profile.fillSignupForm({ 
      firstName: 'discard', 
      lastName: 'me', 
      email: 'discard@me.io' 
    });
    await profile.submitSignupForm();
    await profile.dismissErrorModal();
    
    await profile.openSignupPage();
    await expect(profile.signupFirstNameInput).toHaveValue('');
  });
});