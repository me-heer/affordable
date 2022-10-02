function updateAllPrices() {
    let ecommerce = parseWebsite();

    for (const elementInfo of ecommerce.elements) {
        updatePrice(elementInfo, ecommerce.blacklistedClasses)
    }
}

function main() {
    updateAllPrices();
    setInterval(updateAllPrices, refreshRateInMillis);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "undo") {
            undoUpdates()
        }
    }
);

main();