const blacklistedClasses = ["a-row", "savingsPercentage"];

const elements = [
    {
        className: ".a-price",
        getter: ["firstChild", "textContent"],
        setter: ["lastChild"]
    },
    {
        className: ".a-color-price",
        getter: ["textContent"],
        setter: []
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