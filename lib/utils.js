function getFromStorageSync(itemName, callback) {
    chrome.storage.sync.get(itemName, callback);
}

function getAppendContent(productPrice, salary) {
    let timeTakenToEarn = parseInt(productPrice * (30 / salary));
    if (timeTakenToEarn === 0)
        return ` ${brakets.left}less than 1 day${brakets.right}`
    if (timeTakenToEarn === 1)
        return ` ${brakets.left}1 day${brakets.right}`
    return ` ${brakets.left}${timeTakenToEarn} days${brakets.right}`
}

function isAlreadyAppended(elementText) {
    return elementText.includes(`${brakets.left}`) && elementText.includes(`${brakets.right}`);
}

function containsBlacklistedClasses(element, blacklistedClasses) {
    for (let blacklistedClass of blacklistedClasses) {
        if (element.classList.contains(blacklistedClass))
            return true;
    }
    return false;
}

function isValid(productPrice, element, blacklistedClasses) {
    return !isNaN(productPrice) && productPrice !== 0 && !containsBlacklistedClasses(element, blacklistedClasses) && !isAlreadyAppended(element.textContent);
}