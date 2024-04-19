
const { test } = require('@playwright/test');

test('Login test', async ({ page }) => {
    
    (async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the login page
    await page.goto('https://demo.testim.io/prod/');

    // Fill in login credentials and submit the form
    await page.fill('input[name="email"]', 'ian@testim.io');
    await page.fill('input[name="password"]', 'test!123');
    await page.click('button[type="submit"]');

    // Wait for the page to navigate to the dashboard
    await page.waitForNavigation();

    // Validate the logged-in user
    const loggedInUser = await page.textContent('div[data-testid="user-greeting"]');
    if (loggedInUser.trim() === 'Hello, John') {
        console.log('Logged in user is verified:', loggedInUser);
    } else {
        console.error('Logged in user validation failed:', loggedInUser);
    }

    // Log out
    await page.click('button[data-testid="logout-button"]');

    // Wait for the page to navigate back to the login page
    await page.waitForNavigation();

    console.log('Logged out successfully.');

    // Close the browser
    await browser.close();
})();

});





