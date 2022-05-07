let salary = "48000";

chrome.runtime.onInstalled.addListener(setDefaultSalary);

chrome.tabs.onUpdated.addListener(sendTabUpdatedMessage)

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});

function setDefaultSalary() {
    chrome.storage.sync.set({salary});
    console.log(`Default Salary: ${salary}`);
}

function sendTabUpdatedMessage(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.status === 'complete') {
        // do something here
        chrome.tabs.sendMessage(tabId, {
            message: 'updatePrices'
        }).then(() => {
            console.log("Successfully sent message to a tab")
        }).catch(function (error) {
            console.log("Failed sending message to a tab: " + error)
        })
    }
    return Promise.resolve("Dummy response to keep the console quiet");
}