function getFromStorageSync(itemName, callback) {
    try {
        chrome.storage.sync.get(itemName, callback);
    } catch (e) {
        console.log("Could not get item from chrome.sync");
    }
}

function getAppendContent(productPrice, salary) {
    let timeTakenToEarn = getTimeTakenToEarn(productPrice, salary)
    return ` ${brackets.left}${timeTakenToEarn}${brackets.right}`
}

function getTimeTakenToEarn(productPrice, monthlySalary) {
    let timeTakenToEarn = parseInt(productPrice * (30 / monthlySalary));
    if (timeTakenToEarn === 0)
        return "<1 day";
    if (timeTakenToEarn === 1)
        return "1 day";
    return timeTakenToEarn + " days";
}

function isAlreadyAppended(element, elementInfo) {
    const isAppendedText = element.textContent.includes(`${brackets.left}`) && element.textContent.includes(`${brackets.right}`);
    let actualElement = getElementByKey(element, elementInfo.setter)
    const isAppendedClass = actualElement.classList.contains("tooltip");
    return isAppendedText || isAppendedClass;
}

function isASentence(priceStr) {
    return priceStr.toString().split(" ").length > 1;
}

function containsBlacklistedClasses(element, blacklistedClasses) {
    for (let blacklistedClass of blacklistedClasses) {
        if (element.classList.contains(blacklistedClass))
            return true;
    }
    return false;
}

function isValid(productPrice, element, blacklistedClasses, elementInfo) {
    return !isNaN(productPrice) && productPrice !== 0
        && !containsBlacklistedClasses(element, blacklistedClasses)
        && !isAlreadyAppended(element, elementInfo)
        && !isASentence(getElementByKey(element, elementInfo.getter));
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
        let productPrice = currency(getElementByKey(element, elementInfo.getter)).value;

        if (isValid(productPrice, element, blacklistedClasses, elementInfo)) {
            getFromStorageSync("settings", ({settings}) => {

                let desiredElement = getElementByKey(element, elementInfo.setter);
                if (settings.hoverMode) {
                    desiredElement.classList.add("tooltip")
                    let span = document.createElement("span");
                    span.innerText = getTimeTakenToEarn(productPrice, settings.salary);
                    span.classList.add("tooltiptext");
                    desiredElement.appendChild(span);
                } else {
                    desiredElement.append(getAppendContent(productPrice, settings.salary));
                    desiredElement.setAttribute("title", `You're spending ${getTimeTakenToEarn(productPrice, settings.salary)} of your life`);
                }
            })
        }
    });
}