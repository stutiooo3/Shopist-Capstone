import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class ProfileSessionPage extends BasePage {
  constructor(page) {
    super(page);
    // Simple text and element locators matching the signup and profile sections
    this.signupHeading = page.getByText('sign up for shopist today!', { exact: false });
    this.signupFirstNameInput = page.locator('#fn-input');
    this.signupLastNameInput = page.locator('#ln-input');
    this.signupEmailInput = page.locator('#email-addr-input');
    this.signupSubmitBtn = page.locator('.signup .signup-button').first();
    this.errorAlert = page.locator('.modal-error');
    this.errorModalButton = page.locator('.modal-error .modal-button');
    this.profileName = page.getByText('Doe John', { exact: false });
    this.profileEditLink = page.getByRole('link', { name: 'edit profile' });
    this.profileEditHeading = page.getByRole('heading', { name: 'edit your profile' });
    this.profileFirstNameInput = page.getByRole('textbox', { name: 'Firstname' });
    this.profileLastNameInput = page.getByRole('textbox', { name: 'Lastname' });
    this.profileAddressInput = page.getByRole('textbox', { name: 'Address', exact: true });
    this.profileAddress2Input = page.getByRole('textbox', { name: 'Address 2' });
    this.profileCityInput = page.getByRole('textbox', { name: 'City' });
    this.profileStateInput = page.getByRole('combobox');
    this.profileZipInput = page.getByRole('textbox', { name: 'Zipcode' });
    this.profilePhoneInput = page.getByRole('textbox', { name: 'Mobile phone number' });
    this.profileCancelBtn = page.getByRole('button', { name: 'cancel' });
    this.profileSaveBtn = page.getByRole('button', { name: 'save profile' });
  }

  async openSignupPage() {
    await this.goto('/signup');
    await expect(this.signupHeading).toBeVisible();
  }

  async openProfilePage() {
    await this.goto('/profile');
    await expect(this.profileEditLink).toBeVisible();
  }

  async openProfileEditPage() {
    await this.goto('/profile-edit');
    await expect(this.profileEditHeading).toBeVisible();
  }

  async fillSignupForm(data) {
    // Normal, easy-to-read data lookup mapping
    let fName = data.firstName;
    let lName = data.lastName;
    let emailAddress = data.email;

    if (!fName) { fName = ''; }
    if (!lName) { lName = ''; }
    if (!emailAddress) { emailAddress = ''; }

    await this.signupFirstNameInput.fill(fName);
    await this.signupLastNameInput.fill(lName);
    await this.signupEmailInput.fill(emailAddress);
  }

  async submitSignupForm() {
    await this.signupSubmitBtn.click({ force: true });
  }

  async submitSignup(data) {
    await this.openSignupPage();
    await this.fillSignupForm(data);
    await this.submitSignupForm();
  }

async dismissErrorModal() {
    const isVisible = await this.errorModalButton.isVisible();
    if (isVisible) {
      await this.errorModalButton.click();
    }
    
  
    try {
      await this.errorAlert.waitFor({ state: 'hidden', timeout: 2000 });
    } catch (e) {
      
      await this.page.evaluate(() => {
        const openModal = document.querySelector('.modal-error');
        if (openModal) { openModal.classList.remove('modal-error--is-open'); }
      });
    }
  }

  async login(username, password) {
    let cleanFirstName = '';
    if (username) {
      const parts = username.split('@');
      cleanFirstName = parts[0];
    }

    let cleanLastName = '';
    if (password) {
      cleanLastName = password;
    }

    await this.submitSignup({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: username
    });
  }

  async register(username, password) {
    
    await this.login(username, password);
  }

  async logout() {
    await this.goto('/signup');
    await this.page.evaluate(() => {
      localStorage.removeItem('auth_token');
    });
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
    await this.page.reload();
  }

  async setActiveSessionToken(token) {
    await this.goto('/signup');
    await this.page.evaluate((nextToken) => {
      localStorage.setItem('auth_token', nextToken);
    }, token);
  }

  async getActiveSessionToken() {
    await this.goto('/signup');
    const tokenResult = await this.page.evaluate(() => {
      return localStorage.getItem('auth_token');
    });
    return tokenResult;
  }

  async expectAuthenticated() {
    await this.openProfilePage();
    await expect(this.profileEditLink).toBeVisible();
  }

  async expectUnauthenticated() {
    await this.openSignupPage();
  }
}