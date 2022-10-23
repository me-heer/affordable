let defaultSettings = {
    salary: "5000",
    hoverMode: false,
    disabledSites: [],
    colourCodePrices: true,
}

chrome.runtime.onInstalled.addListener(setConfigs);

function setConfigs() {
    chrome.storage.sync.set({settings: defaultSettings});

    chrome.runtime.openOptionsPage();
}