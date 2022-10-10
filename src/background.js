let defaultSettings = {
    salary: "5000",
    hoverMode: false,
    disabledSites: []
}

chrome.runtime.onInstalled.addListener(setConfigs);

function setConfigs() {
    chrome.storage.sync.set({settings: defaultSettings});
}