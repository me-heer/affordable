// TODO: Update when page URL is updated
// TODO: Listen to extension updates

const blacklistedClasses = ["a-row", "savingsPercentage"];
main();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js

        if (request.message === 'updatePrices') {
            updateAllPrices();
        }
    });


function main() {
    updateAllPrices();
    setInterval(updateAllPrices, 2 * 1000);
}

function updateAllPrices() {
    updateMainPrice(".a-price");
    updateColorPrice(".a-color-price");
    // updateDealPrice(".a-price");
}


function appendColorPrice(element, appendContent) {
    element.append(appendContent);
}

function appendMainPrice(element, appendContent) {
    element.lastChild.append(appendContent);
}

function getAppendContent(productPrice, salary) {
    let timeTakenToEarn = parseInt(productPrice * (30 / salary));
    if (timeTakenToEarn === 0)
        return ` (less than 1 day)`
    if (timeTakenToEarn === 1)
        return ` (1 day)`
    return ` (${timeTakenToEarn} days)`
}

function updateMainPrice(className) {
    let elements = document.querySelectorAll(className);

    elements.forEach((element) => {
        let productPrice = currency(element.firstChild.textContent).value;
        if (!isNaN(productPrice) && productPrice !== 0 && !containsBlacklistedClasses(element) && !isAlreadyAppended(element.textContent)) {
            chrome.storage.sync.get("salary", ({salary}) => {
                appendMainPrice(element, getAppendContent(productPrice, salary));
            });
        }
    });
}

function containsBlacklistedClasses(element) {
    for (let blacklistedClass of blacklistedClasses) {
        if (element.classList.contains(blacklistedClass))
            return true;
    }
    return false;
}

function updateColorPrice(className) {
    let elements = document.querySelectorAll(className);
    elements.forEach((element) => {
        let productPrice = currency(element.textContent).value;
        if (!isNaN(productPrice) && productPrice !== 0 && !containsBlacklistedClasses(element) && !isAlreadyAppended(element.textContent)) {
            chrome.storage.sync.get("salary", ({salary}) => {
                appendColorPrice(element, getAppendContent(productPrice, salary));
            });
        }
    });
}

function updateDealPrice(className) {
    let elements = document.querySelectorAll(className);

    elements.forEach((element) => {
        let productPrice = currency(element.firstChild.textContent).value;
        if (!isNaN(productPrice) && productPrice !== 0 && !containsBlacklistedClasses(element) && !isAlreadyAppended(element.firstChild.textContent)) {
            chrome.storage.sync.get("salary", ({salary}) => {
                appendMainPrice(element, getAppendContent(productPrice, salary));
            });
        }
    });
}

function appendDealPrice(element, appendContent) {
    element.lastChild.append(appendContent);
}

function isAlreadyAppended(elementText) {
    let result = elementText.includes('(') && elementText.includes(')')
    return result;
}