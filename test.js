const puppeteer = require('puppeteer');
const assert = require('assert');
const { v4: uuidv4 } = require('uuid');


const testConfig = {
    flipkart: {
        testPages: ["https://www.flipkart.com/search?q=smartphones"],
    },
    amazon: {
        testPages: ["https://www.amazon.in/s?k=smartphones", "https://www.amazon.in/Apple-iPhone-13-Pro-128/dp/B09V48BYGP"],
    },
    myntra: {
        testPages: ["https://www.myntra.com/men-casual-shirts"],
    },
    ajio: {
        testPages: ["https://www.ajio.com/s/clothing-4461-74581"],
    },
    ebay: {
        testPages: ["https://www.ebay.com/globaldeals"]
    }
}

describe('Testing Affordable on Different Sites', function () {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function () {
        await boot();
    });

    describe('Flipkart Test', async function () {
        const testPages = testConfig.flipkart.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having #affordable as id`, async function () {
                const page = await browser.newPage();
                page.goto(testPage)
                await page.waitForTimeout(5000);
                const appendedElements = await page.$$("#affordable");
                if (!(appendedElements.length > 0)) {
                    await page.screenshot({
                        path: `./test_report/failed_test_flipkart_${uuidv4()}.png`, fullPage: false
                    })
                }
                assert.ok(appendedElements.length > 0, "No appended elements found")
            })
        }
    });
    
    describe('Amazon Test', async function () {
        const testPages = testConfig.amazon.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having #affordable as id`, async function () {
                const page = await browser.newPage();
                await page.goto(testPage)
                const appendedElements = await page.$$("#affordable");
                if (!(appendedElements.length > 0)) {
                    await page.screenshot({
                        path: `./test_report/failed_test_amazon_${uuidv4()}.png`, fullPage: false
                    })
                }
                assert.ok(appendedElements.length > 0, "No appended elements found")
            })
        }
    });

    describe('Myntra Test', async function () {
        const testPages = testConfig.myntra.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having #affordable as id`, async function () {
                if (process.argv.includes('ci')) {
                    this.skip()
                }
                const page = await browser.newPage();
                await page.goto(testPage)
                const appendedElements = await page.$$("#affordable");
                if (!(appendedElements.length > 0)) {
                    await page.screenshot({
                        path: `./test_report/failed_test_myntra_${uuidv4()}.png`, fullPage: false
                    })
                }
                assert.ok(appendedElements.length > 0)
            })
        }
    });

    describe('Ajio Test', async function () {
        const testPages = testConfig.ajio.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having #affordable as id`, async function () {
                if (process.argv.includes('ci')) {
                    this.skip()
                }
                const page = await browser.newPage();
                await page.goto(testPage)
                await page.waitForTimeout(10000);
                const appendedElements = await page.$$("#affordable");
                if (!(appendedElements.length > 0)) {
                    await page.screenshot({
                        path: `./test_report/failed_test_ajio_${uuidv4()}.png`, fullPage: false
                    })
                }
                assert.ok(appendedElements.length > 0)
            })
        }
    });

    describe('eBay Test', async function () {
        const testPages = testConfig.ebay.testPages
        for (let testPage of testPages) {
            it(`Should load ${testPage} with elements having #affordable as id`, async function () {
                const page = await browser.newPage();
                await page.goto(testPage)
                await page.waitForTimeout(10000);
                const appendedElements = await page.$$("#affordable");
                if (!(appendedElements.length > 0)) {
                    await page.screenshot({
                        path: `./test_report/failed_test_ebay_${uuidv4()}.png`, fullPage: false
                    })
                }
                assert.ok(appendedElements.length > 0)
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
