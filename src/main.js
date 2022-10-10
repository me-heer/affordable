// TODO: Segregate functions?


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
    if (debugMode)
        return productPrice

    let timeTakenToEarn = parseInt(productPrice * (30 / monthlySalary));
    if (timeTakenToEarn === 0) return "<1 day";
    if (timeTakenToEarn === 1) return "1 day";
    return timeTakenToEarn + " days";
}

function isAlreadyAppended(element, elementInfo) {
    const elementText = getElementByKey(element, elementInfo.getter)
    const isAppendedText = elementText.includes(`${brackets.left}`) && elementText.includes(`${brackets.right}`);
    const affordableApplied = element.innerHTML.includes('affordable')
    return isAppendedText || affordableApplied;
}

function isASentence(element, elementInfo) {
    const priceStr = getElementByKey(element, elementInfo.getter)
    return priceStr.toString().split(" ").length > 1
        && !priceStr.includes("Rs.")
        && !priceStr.includes("US")
        && !priceStr.includes("to");
}

function containsBlacklistedClasses(element, blacklistedClasses) {
    for (let blacklistedClass of blacklistedClasses) {
        if (element.classList.contains(blacklistedClass)) return true;
    }
    return false;
}


function isValid(productPrice, element, blacklistedClasses, elementInfo) {
    return !isNaN(productPrice) && productPrice !== 0
        && !containsBlacklistedClasses(element, blacklistedClasses)
        && !isAlreadyAppended(element, elementInfo)
        && !isASentence(element, elementInfo);
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
        const elementValue = getElementByKey(element, elementInfo.getter)
        if (elementValue.includes("to")) {
            const fromPrice = elementValue.split("to")[0]
            const toPrice = elementValue.split("to")[1]
            parseAndAppend(fromPrice, element, blacklistedClasses, elementInfo, true)
            parseAndAppend(toPrice, element, blacklistedClasses, elementInfo, true)
        }
        parseAndAppend(elementValue, element, blacklistedClasses, elementInfo, false);
    });
}

function parseAndAppend(elementValue, element, blacklistedClasses, elementInfo, isPriceRange) {
    const parsedPrice = parseElementValue(elementValue);
    let productPrice = currency(parsedPrice).value;
    if (isValid(productPrice, element, blacklistedClasses, elementInfo)) {
        getFromStorageSync("settings", ({ settings }) => {
            const currentUrl = new URL(window.location.toString())
            if (!settings.disabledSites.includes(currentUrl.hostname)) {
                append(elementInfo, element, productPrice, settings, isPriceRange);
            }
        });
    }
}

function append(elementInfo, element, productPrice, settings, isPriceRange) {
    let desiredElement = getElementByKey(element, elementInfo.setter);
    let span = document.createElement("span");
    span.setAttribute('id', 'affordable');
    span.classList.add("affordable-price-converted");
    desiredElement.appendChild(span);

    if (settings.hoverMode) {
        // Hover Mode Attributes
        span.setAttribute('style', 'display:none');
        span.innerText = " " + brackets.left + getTimeTakenToEarn(productPrice, settings.salary) + brackets.right;
        element.classList.add("hover-mode");
        element.addEventListener('mouseover', function handleMouseOver() {
            span.style.display = 'inline';

        });
        element.addEventListener('mouseout', function handleMouseOut() {
            span.style.display = 'none';
        });

    } else {
        // Normal Mode Attributes
        span.innerText = getAppendContent(productPrice, settings.salary);
        if (!isPriceRange) {
            span.setAttribute("style", "display:block");
            desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
        }
    }
}

function parseElementValue(elementValue) {
    let parsed = elementValue;

    parsed = elementValue.replace("Rs.", "")
    parsed = elementValue.replace("US", "")

    return parsed
}

function fetchConfigBasedOnWebsite() {
    const currentUrl = new URL(window.location.toString());
    let ecommerce;
    if (currentUrl.hostname.includes('amazon'))
        ecommerce = AMAZON;
    else if (currentUrl.hostname.includes('flipkart'))
        ecommerce = FLIPKART;
    else if (currentUrl.hostname.includes('myntra'))
        ecommerce = MYNTRA;
    else if (currentUrl.hostname.includes('ajio'))
        ecommerce = AJIO;
    else if (currentUrl.hostname.includes('ebay'))
        ecommerce = EBAY;
    return ecommerce;
}

function undoUpdates() {
    let elements = document.querySelectorAll('#affordable');
    elements.forEach((element) => {
        let tempParentElement = element.parentElement;
        tempParentElement.removeChild(element);
    })
    elements = document.querySelectorAll(".hover-mode")
    elements.forEach((element) => {
        element.classList.remove("hover-mode")
    })

}
