/*
Configuration classes for different ecommerce websites.
 */
const AMAZON_CONFIG = {
    blacklistedClasses: ["a-row", "savingsPercentage"],
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