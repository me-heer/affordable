// TODO: Update when page URL is updated
// TODO: Listen to extension updates

updateMainPrice(".a-price");
updateColorPrice(".a-color-price");

/* Featured Items You May Like Carousel */
// TODO: Fix Formatting, update prices when carousel updates
// 1. Normal Prices
// 2. Deal Prices


function appendColorPrice(element, appendContent) {
    element.append(appendContent);
}

function appendMainPrice(element, appendContent) {
    element.lastChild.append(appendContent);
}

function getAppendContent(productPrice, salary) {
    let timeTakenToEarn = parseInt(productPrice * (30 / salary));
    return ` (${timeTakenToEarn} days)`
}

function updateMainPrice(className) {
    let elements = document.querySelectorAll(className);

    elements.forEach((element) => {
        let productPrice = currency(element.firstChild.textContent).value;
        if (!isNaN(productPrice) && productPrice !== 0) {
            chrome.storage.sync.get("salary", ({salary}) => {
                appendMainPrice(element, getAppendContent(productPrice, salary));
                appended.push(element);
            });
        }
    });
}

function updateColorPrice(className) {
    let elements = document.querySelectorAll(className);
    elements.forEach((element) => {
        let productPrice = currency(element.textContent).value;
        if (!isNaN(productPrice) && productPrice !== 0) {
            chrome.storage.sync.get("salary", ({salary}) => {
                appendColorPrice(element, getAppendContent(productPrice, salary));
                appended.push(element);
            });
        }
    });
}