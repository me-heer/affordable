let defaultSettings = {
    salary: "5000",
    hoverMode: false,
    disabledSites: [],
    colourCodePrices: true,
    percentageMode: false,
    budget: "",
    strictPriceMode: true
}

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get("settings", ({ settings }) => {
        if (!settings) {
            chrome.storage.sync.set({ settings: defaultSettings });
        } else {
            // Enable strictPriceMode by default for existing users
            if (settings.strictPriceMode === undefined) {
                settings.strictPriceMode = true;
                chrome.storage.sync.set({ settings });
            }
        }
    });

    if (details && details.reason === 'install') {
        chrome.runtime.openOptionsPage();
    }
});