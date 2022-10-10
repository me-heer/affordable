function updateAllPrices() {
    getFromStorageSync("settings", ({ settings }) => {
        if (settings.disabled !== true && !settings.disabledSites.includes(new URL(window.location.toString()).hostname)) {
            let ecommerce = fetchConfigBasedOnWebsite();
    
            if (ecommerce) {
                for (const elementInfo of ecommerce.elements) {
                    updatePrice(elementInfo, ecommerce.blacklistedClasses)
                }
            }
        }
    });
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