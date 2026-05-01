import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('https://senjr.vercel.app');
  await expect(page).toHaveTitle(/Senjr/);
  await page.screenshot({ path: 'screenshot_landing.png' });
});

test('login page loads', async ({ page }) => {
  await page.goto('https://senjr.vercel.app/login');
  await expect(page.locator('form')).toBeVisible();
  await page.screenshot({ path: 'screenshot_login.png' });
});

test('signup page loads', async ({ page }) => {
  await page.goto('https://senjr.vercel.app/signup');
  await expect(page.locator('form')).toBeVisible();
  await page.screenshot({ path: 'screenshot_signup.png' });
});
