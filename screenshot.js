import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Capturing landing page...');
  await page.goto('https://senjr.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // extra wait for animations
  await page.screenshot({ path: 'screenshot_landing.png' });

  console.log('Capturing login page...');
  await page.goto('https://senjr.vercel.app/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_login.png' });

  console.log('Capturing signup page...');
  await page.goto('https://senjr.vercel.app/signup', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot_signup.png' });

  await browser.close();
  console.log('Done.');
})();
