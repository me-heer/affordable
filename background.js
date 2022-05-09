let salary = "48000";
let hoverMode = true;

chrome.runtime.onInstalled.addListener(setConfigs);

function setConfigs() {
    chrome.storage.sync.set({salary});
    console.log(`Default Salary: ${salary}`);
    chrome.storage.sync.set({hoverMode});
    console.log(`Hover Mode: ${hoverMode}`);
}