const blacklistedClasses = ["a-row", "savingsPercentage"];

const elements = [
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

main();

function main() {
    updateAllPrices();
    setInterval(updateAllPrices, refreshRateInMillis);
}

function updateAllPrices() {
    for (const elementInfo of elements) {
       updatePrice(elementInfo, blacklistedClasses)
    }
}