const puppeteer = require('puppeteer');
const assert = require('assert');
const config = require("./src/config")


describe('Extension UI Testing', function () {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function () {
        await boot();
    });

    describe('Amazon Price Conversion', async function () {
        it('Normal Mode', async function () {

            const page = await browser.newPage();
            await page.goto(`https://www.amazon.in/s?k=smartphones`)

            const elements = config.AMAZON_CONFIG.elements
            let totalTargetElements = 0;
            for (let element of elements) {
                const targetElements = await page.$$(element.className)
                totalTargetElements = totalTargetElements + targetElements.length
            }

            const appendedElements = await page.$$(config.AFFORDABLE_ID);

            assert.equal(totalTargetElements, appendedElements.length)
        })
    });


    after(async function () {
        await browser.close();
    });
});


async function boot() {
    const pathToExtension = require('path').join(__dirname, 'src');
    browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });
};
