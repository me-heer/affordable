const refreshRateInMillis = 1000;

const brackets = {
    left: "(", right: ")"
}

let debugMode = false;

/*
Configurations for different ecommerce websites.
 */
const AMAZON = {
    blacklistedClasses: ["a-row", "savingsPercentage"],
    blacklistedAttributes: ['data-a-strike'],
    elements: [
        {
            className: ".a-price",
            getter: ["firstChild", "textContent"],
            setter: ["lastChild"]
        },
        {
            className: ".a-color-price",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".a-size-base-plus",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".a-price.octopus-widget-price",
            getter: ["lastChild", "children", "1", "textContent"],
            setter: ["lastChild"]
        },
        {
            className: ".reinventPricePriceToPayMargin",
            getter: ["lastChild", "children", "1", "textContent"],
            setter: ["lastChild"]
        }
    ]
}

const FLIPKART = {
    blacklistedClasses: [],
    elements: [
        {
            className: ".Nx9bqj",
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
            setter: ["firstChild"]
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
            getter: ["firstElementChild", "firstElementChild", "textContent"],
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

const TAKEALOT = {
    blacklistedClasses: [],
    elements: [
        {
            className: ".currency",
            getter: ["textContent"],
            setter: []
        }
    ]
}

const MEESHO = {
    blacklistedClasses: ["UKsFl"],
    elements: [
        {
            className: ".NewProductCardstyled__PriceRow-sc-6y2tys-7",
            getter: ["firstChild", "textContent"],
            setter: []
        },
        {
            className: ".fka-Dwo",
            getter: ["textContent"],
            setter: []
        }
    ]
}

const OLX = {
    blacklistedClasses: [],
    elements: [
        {
            className: "._2Ks63",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".T8y-z",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".boost-pfs-filter-product-item-regular-price",
            getter: ["textContent"],
            setter: []
        },
        {
            className: "._1zgtX",
            getter: ["textContent"],
            setter: []
        },
        {
            className: "._1uqlc",
            getter: ["textContent"],
            setter: []
        },
        {
            className: ".price",
            getter: ["textContent"],
            setter: []
        }
    ]

}

const AFFORDABLE_ID = "#affordable"