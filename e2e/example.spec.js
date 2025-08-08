// @ts-check
const { test, expect } = require('@playwright/test');
const config = require('./config');
const PlaywrightHelper = require('./playwrightHelper');


const testData = {
  email: 'ian@sealights.com',
  address: '123 Main Street',
  city: 'Austin',
  state: 'TX',
  zip: '78757',
  cvv: '123',
  baseURL: 'https://ian-btq.btq.sealights.co/'
};

async function fillCheckoutForm(page, data) {
  await page.getByLabel('E-mail Address').fill(data.email);
  await page.getByLabel('Street Address').fill(data.address);
  await page.getByLabel('Zip Code').fill(data.zip);
  await page.getByLabel('City').fill(data.city);
  await page.getByLabel('State').fill(data.state);
  await page.getByLabel('CVV').fill(data.cvv);
}

test('Add single item to cart and complete checkout', async ({ page }) => {
  await page.goto(testData.baseURL);

  // Click first product
  await page.locator('.col-md-4 > a').first().click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();

  // Fill and place order
  await fillCheckoutForm(page, testData);
  await page.getByRole('button', { name: 'Place Order' }).click();

  // Assertions
  await expect(page.getByText('Your order is complete!')).toBeVisible();
  await expect(page.getByText(/[\d]+\.\d{2}/)).toBeVisible(); // Validate total format
});


test('Add Watch to Cart and validate', async ({ page }) => {

  await page.goto(testData.baseURL);
  await page.locator('div:nth-child(4) > a').click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByText('Quantity:').click();
  await page.getByText('$109.99').click();
  await page.getByText('$8.99').click();
  await page.getByText('$118.98').click();
  await page.getByRole('button', { name: 'Empty Cart' }).click();
});


test('Add Salt and Pepper Shakers to cart and validate', async ({ page }) => {
  await page.goto(testData.baseURL);
  await page.locator('div:nth-child(8) > a').click();
  await page.locator('#quantity').selectOption('2');
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByText('Quantity:').click();
  await page.getByText('$36.98').click();
  await page.getByText('$8.99').click();
  await page.getByText('$45.97').click();
  await page.getByRole('button', { name: 'Empty Cart' }).click();
});

/*
test('Add all items to cart and validate total', async ({ page }) => {
  await page.goto('https://ian-btq.btq.sealights.co/');

  // Locate all product items and click 'Add to cart' for each
  const productItems = await page.locator('text=$').elementHandles(); 
  // Alternative: use specific selectors if you add buttons with recognisable text or CSS selectors

  let expectedTotal = 0;

  for (const item of productItems) {
    const priceText = await item.textContent();
    const match = priceText && priceText.match(/\$(\d+\.\d{2})/);
    if (match) {
      expectedTotal += parseFloat(match[1]);
      await item.click(); // click on the item to add to cart
    }
  }

  // Open cart — adjust selector if there is a dedicated cart button/link
  await page.click('text=Cart');

  // Grab actual total from cart summary
  const totalLocator = page.locator('text=Total').first();
  const totalText = await totalLocator.textContent();
  const totalMatch = totalText && totalText.match(/\$(\d+\.\d{2})/);
  const actualTotal = totalMatch ? parseFloat(totalMatch[1]) : null;

  // Assert totals match
  expect(actualTotal).not.toBeNull();
  expect(actualTotal).toBeCloseTo(expectedTotal, 2);
});
*/
