const { chromium } = require('playwright');

(async () => {
    // Launch the browser
    const browser = await chromium.launch();

    // Create a new browser context
    const context = await browser.newContext();

    // Create a new page within the context
    const page = await context.newPage();

    // Navigate to a webpage
    await page.goto('https://demo.testim.io/prod');

    // Perform an action (e.g., click a link)
    await page.click('document.querySelector("#app > div > header > div > div:nth-child(2) > ul > li > button")');

    // Wait for a specific element to appear
    await page.waitForSelector('h1');

    // Extract text content from an element
    const title = await page.title();
    console.log('Page title:', title);

    // Close the browser
    await browser.close();
})();

