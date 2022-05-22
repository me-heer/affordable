let settings = {
    salary: "65000",
    hoverMode: false
}

chrome.runtime.onInstalled.addListener(setConfigs);

function setConfigs() {
    chrome.storage.sync.set({settings});
    console.log(`Default Salary: ${settings.salary}`);
    console.log(`Hover Mode: ${settings.hoverMode}`);
}