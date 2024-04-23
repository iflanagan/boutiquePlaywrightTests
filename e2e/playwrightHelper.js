const { chromium } = require('playwright');

class PlaywrightHelper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
  }

  async goTo(url) {
    await this.page.goto(url);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async type(selector, text) {
    await this.page.type(selector, text);
  }

  async waitForSelector(selector) {
    await this.page.waitForSelector(selector);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async screenshot(path) {
    await this.page.screenshot({ path });
  }

  async close() {
    await this.browser.close();
  }
}

module.exports = PlaywrightHelper;

