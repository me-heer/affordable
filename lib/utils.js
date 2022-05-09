function getFromStorageSync(itemName, callback) {
    try {
        chrome.storage.sync.get(itemName, callback);
    } catch (e) {
        console.log("Could not get salary from chrome.sync");
    }
}

function getAppendContent(productPrice, salary) {
    let timeTakenToEarn = getTimeTakenToEarn(productPrice, salary)
    return ` ${brackets.left}${timeTakenToEarn}${brackets.right}`
}

function getTimeTakenToEarn(productPrice, monthlySalary) {
    let timeTakenToEarn = parseInt(productPrice * (30 / monthlySalary));
    if (timeTakenToEarn === 0)
        return "less than 1 day";
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
        && !isAlreadyAppended(element, elementInfo);
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
            getFromStorageSync("salary", ({salary}) => {

                let desiredElement = getElementByKey(element, elementInfo.setter);
                desiredElement.setAttribute("class","tooltip");
                let span = document.createElement("span");
                span.innerText = getTimeTakenToEarn(productPrice, salary);
                span.classList.add("tooltiptext");
                desiredElement.appendChild(span);
                // desiredElement.append(getAppendContent(productPrice, salary));
                desiredElement.setAttribute("title", `You're spending ${getTimeTakenToEarn(productPrice, salary)} of your life`);

            })
        }
    });
}