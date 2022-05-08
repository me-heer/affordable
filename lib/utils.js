function getFromStorageSync(itemName, callback) {
    chrome.storage.sync.get(itemName, callback);
}

function getAppendContent(productPrice, salary) {
    let timeTakenToEarn = parseInt(productPrice * (30 / salary));
    if (timeTakenToEarn === 0)
        return ` ${brackets.left}less than 1 day${brackets.right}`
    if (timeTakenToEarn === 1)
        return ` ${brackets.left}1 day${brackets.right}`
    return ` ${brackets.left}${timeTakenToEarn} days${brackets.right}`
}

function isAlreadyAppended(elementText) {
    return elementText.includes(`${brackets.left}`) && elementText.includes(`${brackets.right}`);
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

function getElementByKey(element, getterKey) {
    let desiredElement = element;
    for (const key of getterKey) {
        desiredElement = desiredElement[key.toString()]
    }
    return desiredElement;
}

function updatePrice(elementInfo, blacklistedClasses) {
    let elements = document.querySelectorAll(elementInfo.className);
    elements.forEach((element) => {
        let productPrice = currency(getElementByKey(element, elementInfo.getter)).value

        if (isValid(productPrice, element, blacklistedClasses)) {
            getFromStorageSync("salary", ({salary}) => {
                getElementByKey(element, elementInfo.setter).append(getAppendContent(productPrice, salary));
            })
        }
    });
}