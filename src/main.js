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
    if (timeTakenToEarn >= 30) {
        // More than 1 month
        let months = Math.floor(timeTakenToEarn / 30)
        if (months === 1)
            months = months + " month"
        else
            months = months + " months"
        let days = (timeTakenToEarn % 30)
        if (days == 0)
            return months
        else if (days === 1)
            days = days + " day"
        else
            days = days + " days"
        return months + ", " + days
    }

    return timeTakenToEarn + " days";
}

function getDays(productPrice, monthlySalary) {
    return parseInt(productPrice * (30 / monthlySalary));
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
        && !priceStr.includes("R ")
        && !priceStr.includes("From Rs. ")
        && !priceStr.includes("₹ ")
        && !priceStr.includes("onwards")
        && (!priceStr.includes("to") || priceStr.includes("stock"));
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
        if (desiredElement)
            desiredElement = desiredElement[key.toString()]
    }
    return desiredElement;
}

function updatePrice(elementInfo, blacklistedClasses) {
    let elements = document.querySelectorAll(elementInfo.className);
    elements.forEach((element) => {
        const elementValue = getElementByKey(element, elementInfo.getter)
        if (elementValue && elementValue.includes("to")) {
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
            append(elementInfo, element, productPrice, settings, isPriceRange);
        });
    }
}

function append(elementInfo, element, productPrice, settings, isPriceRange) {
    let desiredElement = getElementByKey(element, elementInfo.setter);
    let span = document.createElement("span");
    span.setAttribute('id', 'affordable');
    desiredElement.appendChild(span);

    if (settings.hoverMode) {
        // Hover Mode Attributes
        span.setAttribute('style', 'display:none');
        span.innerText = " " + brackets.left + getTimeTakenToEarn(productPrice, settings.salary) + brackets.right;
        element.classList.add("hover-mode");
        element.addEventListener('mouseover', function handleMouseOver() {
            span.style.display = 'block';

        });
        element.addEventListener('mouseout', function handleMouseOut() {
            span.style.display = 'none';
        });

    } else {
        // Normal Mode Attributes
        let innerSpan = document.createElement("span")
        if (settings.colourCodePrices) {
            addFontDetailsBasedOnColourCode(innerSpan, true, getDays(productPrice, settings.salary))
        }
        innerSpan.innerText = getAppendContent(productPrice, settings.salary);
        span.appendChild(innerSpan)
        if (!isPriceRange) {
            span.setAttribute("style", "display:block");
            desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
        }
    }
}

function addFontDetailsBasedOnColourCode(element, colourCodePrices, days) {
    let defaultStyleAttributes = ''
    if (colourCodePrices) {
        if (days <= 30)
            defaultStyleAttributes += 'color: var(--affordable-highlight-primary)'
        else if (days > 30 && days <= 90)
            defaultStyleAttributes += 'color: var(--affordable-highlight-secondary)'
        else
            defaultStyleAttributes += 'color: var(--affordable-highlight-tertiary)'
    }
    element.setAttribute('style', defaultStyleAttributes)
}

function addClassBasedOnColourCode(element, colourCodePrices, days) {
    if (colourCodePrices) {
        if (days <= 30)
            element.classList.add("affordable-highlight-primary")
        else if (days > 30 && days <= 180)
            element.classList.add("affordable-highlight-secondary")
        else
            element.classList.add("affordable-highlight-tertiary")
    } else {
        element.classList.add("affordable-highlight-primary")
    }
}

function parseElementValue(elementValue) {
    let parsed = elementValue;

    parsed = parsed.replace("Rs.", "")
    parsed = parsed.replace("Rs. ", "")
    parsed = parsed.replace("From Rs. ", "")
    parsed = parsed.replace("US", "")

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
    else if (currentUrl.hostname.includes('takealot'))
        ecommerce = TAKEALOT;
    else if (currentUrl.hostname.includes('meesho'))
        ecommerce = MEESHO;
    else if (currentUrl.hostname.includes('olx'))
        ecommerce = OLX;
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

    elements = document.querySelectorAll(".affordable-highlight-primary")
    elements.forEach((element) => {
        element.classList.remove("affordable-highlight-primary")
    })

    elements = document.querySelectorAll(".affordable-highlight-secondary")
    elements.forEach((element) => {
        element.classList.remove("affordable-highlight-secondary")
    })

    elements = document.querySelectorAll(".affordable-highlight-tertiary")
    elements.forEach((element) => {
        element.classList.remove("affordable-highlight-tertiary")
    })

}