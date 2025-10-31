let defaultSettings = {
    salary: "5000",
    hoverMode: false,
    disabledSites: [],
    colourCodePrices: true,
    percentageMode: false,
    budget: ""
}

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get("settings", ({ settings }) => {
        if (!settings) {
            chrome.storage.sync.set({ settings: defaultSettings });
        }
    });

    if (details && details.reason === 'install') {
        chrome.runtime.openOptionsPage();
    }
});