const puppeteer = require('puppeteer');
const assert = require('assert');
const config = require("./src/config")


describe('Testing Affordable on Different Sites', function () {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function () {
        await boot();
    });

    describe('Flipkart Test', async function () {
        const testPages = config.FLIPKART_CONFIG.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having affordable as id`, async function () {
                const page = await browser.newPage();
                page.goto(testPage)
                await page.waitForTimeout(5000);
                const appendedElements = await page.$$(config.AFFORDABLE_ID);
                assert.ok(appendedElements.length > 0, "No appended elements found")
            })
        }
    });

    after(async function () {
        await browser.close();
    });
});


describe('Testing Affordable on Different Sites', function () {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function () {
        await boot();
    });

    describe('Amazon Test', async function () {
        const testPages = config.AMAZON_CONFIG.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having affordable as id`, async function () {
                const page = await browser.newPage();
                await page.goto(testPage)
                await page.waitForTimeout(5000);
                const appendedElements = await page.$$(config.AFFORDABLE_ID);
                assert.ok(appendedElements.length > 0, "No appended elements found")
            })
        }
    });

    after(async function () {
        await browser.close();
    });
});

describe('Testing Affordable on Different Sites', function () {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function () {
        await boot();
    });

    describe('Myntra Test', async function () {
        const testPages = config.MYNTRA_CONFIG.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having affordable as id`, async function () {
                const page = await browser.newPage();
                await page.goto(testPage)
                await page.waitForTimeout(5000);
                const appendedElements = await page.$$(config.AFFORDABLE_ID);
                assert.ok(appendedElements.length > 0, "No appended elements found")
            })
        }
    });

    after(async function () {
        await browser.close();
    });
});


async function boot() {
    const pathToExtension = require('path').join(__dirname, 'src');
    browser = await puppeteer.launch({
        headless: 'chrome',
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });
};
