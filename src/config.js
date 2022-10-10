const refreshRateInMillis = 500;

const brackets = {
    left: "(", right: ")"
}

let debugMode = false;

/*
Configurations for different ecommerce websites.
 */
const AMAZON = {
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
        },
        {
            className: ".a-size-base-plus",
            getter: ["textContent"],
            setter: [],
            elementGetter: []
        }
    ]
}

const FLIPKART = {
    blacklistedClasses: [],
    elements: [
        {
            className: "._30jeq3",
            getter: ["textContent"],
            setter: []
        }
    ]
}

const MYNTRA = {
    blacklistedClasses: [],
    elements: [
        {
            className: ".product-discountedPrice",
            getter: ["textContent"],
            setter: []
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
        },
        {
            className: ".product-price",
            getter: ["firstChild", "textContent"],
            setter: []
        },
    ]
}

const AJIO = {
    blacklistedClasses: [],
    elements: [
        {
            className: ".price  ",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".prod-sp",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".sec-prod-cp",
            getter: ["textContent"],
            setter: []
        },
    ]
}

const EBAY = {
    blacklistedClasses: [],
    elements: [
        {
            className: ".s-item__price",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".item-info__price",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".hl-item__displayPrice",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".mainPrice",
            getter: ["firstElementChild","firstElementChild","textContent"],
            setter: []
        },
        {
            className: ".price",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".first",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".default",
            getter: ["textContent"],
            setter: []
        },
    ]
}

const AFFORDABLE_ID = "#affordable"