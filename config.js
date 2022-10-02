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
