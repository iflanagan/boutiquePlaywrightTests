// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('./config');
const PlaywrightHelper = require('./playwrightHelper');


test('Select Travelers', async ({ page }) => {
    // Navigate to the web app
    await page.goto('https://demo.testim.io/prod/');
  
    // Select 2 adults
    await page.locator('div').filter({ hasText: /^Adults \(18\+\)1234$/ }).getByRole('textbox').click();
    await page.getByText('2', { exact: true }).first().click();
  
    // Select 4 children
    await page.locator('div').filter({ hasText: /^Children \(0-7\)1234$/ }).getByRole('textbox').click();
    await page.getByText('4', { exact: true }).nth(1).click();
  
    // Validate the selected travelers on the page
    const selectedAdults = await page.locator('div').filter({ hasText: /^Adults \(18\+\): 2$/ }).first().innerText();
    const selectedChildren = await page.locator('div').filter({ hasText: /^Children \(0-7\): 4$/ }).first().innerText();
  
    // Assert that the selected travelers match the expected values
    expect(selectedAdults).toContain('Adults (18+): 2');
    expect(selectedChildren).toContain('Children (0-7): 4');
  });


  

test('Validate Title Demo page', async ({ page }) => {


  // await page.goto('https://demo.testim.io/prod/'); 
  await page.goto(config.baseUrl);
 // await page.pause();

    // Get the title of the page
    const pageTitle = await page.title();
    console.log(` current title is: ${pageTitle}`);
    
   // await page.pause();

   await expect(page).toHaveTitle(config.expectedPageTitle);

  /*
    if (pageTitle === config.expectedPageTitle) {
        console.log('Title validation passed.');
    } else {
        console.error(`Title validation failed. Expected: ${config.expectedPageTitle} Actual: ${pageTitle}`);
    }
    */
  
});


test('Select Destination', async ({ page }) => {
    await page.goto(config.baseUrl);
    await page.getByRole('button', { name: 'Select Destination' }).click();
  });



test('Login Test Demo Site', async ({ page }) => {

  await page.goto(config.baseUrl);


        // Find the element using JavaScript path and querySelector
        const loginButtonHandle = await page.evaluateHandle(() => {
          return document.querySelector('#app > div > header > div > div:nth-child(2) > ul > li > button');
      });

      const userInput = await page.evaluateHandle (() => {
        return document.querySelector('#login > div:nth-child(1) > input');
    });

    const passwordInput = await page.evaluateHandle (() => {
      return document.querySelector('#login > div:nth-child(2) > input');
  });



  /*
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.locator('#login input[type="text"]').click();
  await page.locator('#login input[type="text"]').fill('ian@testim.io');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('isdgoISAGHSOI');
  await page.getByRole('navigation').getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Hello, John' }).click();
  await page.getByRole('link', { name: 'Log out' }).click();
  */


      // @ts-ignore
      console.log('Click Login button');
      await loginButtonHandle.click();

      console.log('Enter username: ' +config.username);
      // Fill in login credentials and submit the form
      await page.type('#login > div:nth-child(1) > input', config.username, { delay: 100 }); // Adds a delay of 100 milliseconds between key presses
     // await page.waitForTimeout(config.timeout);

      // @ts-ignore
      //await passwordInput.click();
      console.log('Enter password: ' +config.password);
      await page.keyboard.press('Tab');
      await page.fill('#login > div:nth-child(2) > input', config.password);
     // await page.waitForTimeout(config.timeout);

      console.log('Click Login button');
      await page.click('button[type="submit"]');
        // Validate if login was successful
        const loggedInUser = await page.textContent('#app > div > header > div > div:nth-child(2) > ul > div > button > span:nth-child(1)');
        // @ts-ignore

        await page.waitForTimeout(config.timeout);
        console.log('Perform Validation!');
        // @ts-ignore
        if (loggedInUser.trim() === config.loggedInUser) {
            console.log('Login successful. Logged in as:', loggedInUser);
        } else {
            console.error('Login failed. Unexpected logged in user:', loggedInUser);
        }

        console.log('Logout now');
      //  await page.waitForTimeout(config.timeout);
        await page.click('#app > div > header > div > div:nth-child(2) > ul > div > button > span:nth-child(1)');
      //  await page.waitForTimeout(config.timeout);
        await page.click('#app > div > header > div > div:nth-child(2) > ul > div > ul > li > a');
        

});

