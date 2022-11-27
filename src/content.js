function updateAllPrices() {
    getFromStorageSync("settings", ({ settings }) => {
        if (settings.disabled !== true && !settings.disabledSites.includes(new URL(window.location.toString()).hostname)) {
            let websiteConfig = fetchConfigBasedOnWebsite();
    
            if (websiteConfig) {
                for (const elementInfo of websiteConfig.elements) {
                    updatePrice(elementInfo, websiteConfig)
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