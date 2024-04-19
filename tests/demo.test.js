const { chromium } = require('playwright');

(async () => {
    // Launch the browser
    const browser = await chromium.launch();

    // Create a new browser context
    const context = await browser.newContext();

    // Create a new page within the context
    const page = await context.newPage();

    // Navigate to the specified URL
    await page.goto('https://demo.testim.io/prod/');

    // Extract the title of the page
    const pageTitle = await page.title();

    // Output the title to the console
    console.log('Page Title:', pageTitle);

    // Close the browser
    await browser.close();
})();
