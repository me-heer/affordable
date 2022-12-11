let defaultSettings = {
    salary: "5000",
    hoverMode: false,
    disabledSites: [],
    colourCodePrices: true,
    percentageMode: false,
    budget: ""
}

chrome.runtime.onInstalled.addListener(setConfigs);

function setConfigs() {
    chrome.storage.sync.get("settings", ({ settings }) => {
        if (!settings) {
            chrome.storage.sync.set({ settings: defaultSettings });
        }
    });

    chrome.runtime.openOptionsPage();
}