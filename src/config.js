/*
Configuration classes for different ecommerce websites.
 */
const AMAZON_CONFIG = {
    blacklistedClasses: ["a-row", "savingsPercentage"],
    testPages: ["https://www.amazon.in/s?k=smartphones", "https://www.amazon.in/Apple-iPhone-13-Pro-128/dp/B09V48BYGP"],
    elements: [
        {
            className: ".a-price",
            getter: ["firstChild", "textContent"],
            setter: ["lastChild"],
            elementGetter: ["firstChild"]
        },
        {
            className: ".a-color-price",
            getter: ["textContent"],
            setter: [],
            elementGetter: []
        }
    ]
}

const FLIPKART_CONFIG = {
    blacklistedClasses: [],
    testPages: ["https://www.flipkart.com/search?q=smartphones"],
    elements: [
        {
            className: "._30jeq3",
            getter: ["textContent"],
            setter: []
        }
    ]
}

const MYNTRA_CONFIG = {
    blacklistedClasses: [],
    testPages: ["https://www.myntra.com/men-casual-shirts"],
    elements: [
        {
            className: ".product-discountedPrice",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".product-price",
            getter: ["firstChild", "textContent"],
            setter: ["firstChild"],
            elementGetter: ["firstChild"]
        },
        {
            className: ".pdp-price",
            getter: ["firstChild", "textContent"],
            setter: ["firstChild"],
            elementGetter: ["firstChild"]
        },
        {
            className: ".product-item-selling-price",
            getter: ["textContent"],
            setter: []
        }
    ]
}

const AFFORDABLE_ID = "#affordable"

module.exports = { AMAZON_CONFIG, FLIPKART_CONFIG, MYNTRA_CONFIG, AFFORDABLE_ID }