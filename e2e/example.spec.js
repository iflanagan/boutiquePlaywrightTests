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

test('Add multiple items to cart and verify before checkout', async ({ page }) => {
  await page.goto(testData.baseURL);

  const products = page.locator('.col-md-4 > a');

  // Add first two products
  for (let i = 0; i < 2; i++) {
    await products.nth(i).click();
    await page.getByRole('button', { name: 'Add To Cart' }).click();
    await page.goto(testData.baseURL);
  }

  // Go to cart page
  await page.goto(`${testData.baseURL}cart/checkout`);

  // Expect 2 product cards in checkout summary
  const itemsInCart = page.locator('.checkout .cart-item');
  await expect(itemsInCart).toHaveCount(2);

  // Complete checkout
  await fillCheckoutForm(page, testData);
  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByText('Your order is complete!')).toBeVisible();
});

test('Add item then remove it from cart and validate empty', async ({ page }) => {
  await page.goto(testData.baseURL);

  // Add one product
  await page.locator('.col-md-4 > a').first().click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();

  // Go to cart
  await page.goto(`${testData.baseURL}cart/checkout`);

  // Click remove button (assuming there's one per cart item)
  const removeButton = page.locator('button', { hasText: 'Remove' }).first();
  if (await removeButton.isVisible()) {
    await removeButton.click();
  }

  // Verify cart is now empty
  await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
});


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

