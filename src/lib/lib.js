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
    const affordableApplied = element.innerHTML.includes('affordable')
    return isAppendedText || affordableApplied;
}

function isASentence(priceStr) {
    return priceStr.toString().split(" ").length > 1 && !priceStr.includes("Rs.");
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
        && !isASentence(getElementByKey(element, elementInfo.getter));
}

function myntraCustomCheck(element, elementInfo) {
    const elementValue = getElementByKey(element, elementInfo.getter)
    return elementValue.includes("Rs.")
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
        const parsedPrice = parseElementValue(elementValue)
        let productPrice = currency(parsedPrice).value;

        if (isValid(productPrice, element, blacklistedClasses, elementInfo)) {
            getFromStorageSync("settings", ({ settings }) => {

                let desiredElement = getElementByKey(element, elementInfo.setter);
                let span = document.createElement("span");
                span.setAttribute('id', 'affordable')
                span.classList.add("affordable-price-converted");
                desiredElement.appendChild(span);
                if (settings.hoverMode) {
                    span.setAttribute('style', 'display:none')
                    span.innerText = " " + brackets.left + getTimeTakenToEarn(productPrice, settings.salary) + brackets.right
                    element.classList.add("hover-mode")
                    element.addEventListener('mouseover', function handleMouseOver() {
                        span.style.display = 'inline';
                        
                    });
                    element.addEventListener('mouseout', function handleMouseOut() {
                        span.style.display = 'none';
                        
                    });

                } else {
                    span.innerText = getAppendContent(productPrice, settings.salary);
                    span.setAttribute("style", "display:block")
                    desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
                }
            })
        }
    });
}

function parseElementValue(elementValue) {
    let parsed = elementValue;

    // Happens in the case of Myntra
    parsed = elementValue.replace("Rs.", "")

    return parsed
}

function parseWebsite() {
    currentUrl = window.location.toString();
    let ecommerce;
    if (currentUrl.includes('amazon'))
        ecommerce = AMAZON_CONFIG;
    else if (currentUrl.includes('flipkart'))
        ecommerce = FLIPKART_CONFIG;
    else if (currentUrl.includes('myntra'))
        ecommerce = MYNTRA_CONFIG;
    else if (currentUrl.includes('ajio'))
        ecommerce = AJIO_CONFIG;
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
