let settings = {
    salary: "30000",
    hoverMode: true
}

chrome.runtime.onInstalled.addListener(setConfigs);

function setConfigs() {
    chrome.storage.sync.set({settings});
    console.log(`Default Salary: ${settings.salary}`);
    console.log(`Hover Mode: ${settings.hoverMode}`);
}