// TODO: Better name for file
// TODO: Segregate functions?

const refreshRateInMillis = 500;

const brackets = {
    left: "(", right: ")"
}

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
    if (timeTakenToEarn === 0) return "<1 day";
    if (timeTakenToEarn === 1) return "1 day";
    return timeTakenToEarn + " days";
}

function isAlreadyAppended(element, elementInfo) {
    const isAppendedText = element.textContent.includes(`${brackets.left}`) && element.textContent.includes(`${brackets.right}`);
    let actualElement = getElementByKey(element, elementInfo.setter)
    const isAppendedClass = actualElement.classList.contains("affordable-tooltip");
    return isAppendedText || isAppendedClass;
}

function isASentence(priceStr) {
    return priceStr.toString().split(" ").length > 1;
}

function containsBlacklistedClasses(element, blacklistedClasses) {
    for (let blacklistedClass of blacklistedClasses) {
        if (element.classList.contains(blacklistedClass)) return true;
    }
    return false;
}

// TODO: Refactor this
function isValid(productPrice, element, blacklistedClasses, elementInfo) {
    return !isNaN(productPrice) && productPrice !== 0 && !containsBlacklistedClasses(element, blacklistedClasses) && (!isAlreadyAppended(element, elementInfo)) && !isASentence(getElementByKey(element, elementInfo.getter));
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
                    desiredElement.classList.add("affordable-tooltip");
                    let span = document.createElement("span");
                    span.setAttribute('id', 'affordable')
                    span.innerText = getTimeTakenToEarn(productPrice, settings.salary);
                    span.classList.add("affordable-tooltiptext");
                    desiredElement.appendChild(span);
                } else {
                    let span = document.createElement("span");
                    span.innerText = getAppendContent(productPrice, settings.salary);
                    span.setAttribute('id', 'affordable')
                    span.setAttribute("style", "display:block");
                    desiredElement.appendChild(span);
                    desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
                }
            })
        }
    });
}

function parseWebsite() {
    currentUrl = window.location.toString();
    let ecommerce;
    if (currentUrl.includes('amazon'))
        ecommerce = AMAZON_CONFIG;
    else if (currentUrl.includes('flipkart'))
        ecommerce = FLIPKART_CONFIG;
    return ecommerce;
}

function undoUpdates() {
    let elements = document.querySelectorAll('#affordable');
    elements.forEach((element) => {
        let tempParentElement = element.parentElement;
        tempParentElement.removeChild(element);
    })
    let hoverModeElements = document.querySelectorAll('.affordable-tooltip');
    hoverModeElements.forEach((element) => {
        element.classList.remove('affordable-tooltip')
    })
}
