const blacklistedClasses = [];

const elements = [
    {
        className: "._30jeq3",
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

