let salary = "48000";

chrome.runtime.onInstalled.addListener(setDefaultSalary);

function setDefaultSalary() {
    chrome.storage.sync.set({salary});
    console.log(`Default Salary: ${salary}`);
}