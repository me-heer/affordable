// TODO: Update when page URL is updated
// TODO: Listen to extension updates

const blacklistedClasses = [];
main();

function main() {
    updateAllPrices();
    setInterval(updateAllPrices, 1 * 1000);
}

function updateAllPrices() {
    updateMainPrice("._30jeq3");
}

function appendMainPrice(element, appendContent) {
    element.append(appendContent);
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
    console.log("Total Elements: " + elements.length)

    elements.forEach((element) => {
        let productPrice = currency(element.textContent).value;
        if (!isNaN(productPrice) && productPrice !== 0 && !containsBlacklistedClasses(element)  && !isAlreadyAppended(element.textContent)) {
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


function isAlreadyAppended(elementText) {
    let result = elementText.includes('(') && elementText.includes(')')
    return result;
}
