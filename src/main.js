function getFromStorageSync(itemName, callback) {
    try {
        chrome.storage.sync.get(itemName, callback);
    } catch (e) {
        console.log("Could not get item from chrome.sync");
    }
}

function getAppendContent(productPrice, salary, percentageMode) {
    if (percentageMode) {
        let percentage = getPriceInSalaryPercentage(productPrice, salary);
        return `${brackets.left}${percentage}%${brackets.right}`
    }
    let timeTakenToEarn = getTimeTakenToEarn(productPrice, salary);
    return ` ${brackets.left}${timeTakenToEarn}${brackets.right}`
}

function getPriceInSalaryPercentage(productPrice, salary) {
    let percentage = (productPrice / salary) * 100;
    percentage = Math.round(percentage * 100) / 100;
    return percentage;
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
        if (days === 0)
            return months
        else if (days === 1)
            days = days + " day"
        else
            days = days + " days"
        return months + ", " + days
    }

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

function containsBlacklistedAttributes(element, blacklistedAttributes) {
    if (blacklistedAttributes) {
        for (let blacklistedAttribute of blacklistedAttributes) {
            if (element.attributes.getNamedItem(blacklistedAttribute)) return true;
        }
    }
    return false;
}

function isValid(productPrice, element, websiteConfig, elementInfo) {
    return !isNaN(productPrice) && productPrice !== 0
        && !containsBlacklistedClasses(element, websiteConfig.blacklistedClasses)
        && !containsBlacklistedAttributes(element, websiteConfig.blacklistedAttributes)
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

function updatePrice(elementInfo, websiteConfig) {
    let elements = document.querySelectorAll(elementInfo.className);
    elements.forEach((element) => {
        const elementValue = getElementByKey(element, elementInfo.getter)
        if (elementValue && elementValue.includes("to")) {
            const fromPrice = elementValue.split("to")[0]
            const toPrice = elementValue.split("to")[1]
            parseAndAppend(fromPrice, element, websiteConfig, elementInfo, true)
            parseAndAppend(toPrice, element, websiteConfig, elementInfo, true)
        }
        parseAndAppend(elementValue, element, websiteConfig, elementInfo, false);
    });
}

function parseAndAppend(elementValue, element, websiteConfig, elementInfo, isPriceRange) {
    const parsedPrice = parseElementValue(elementValue);
    let productPrice = currency(parsedPrice).value;
    if (isValid(productPrice, element, websiteConfig, elementInfo)) {
        getFromStorageSync("settings", ({ settings }) => {
            append(elementInfo, element, productPrice, settings, isPriceRange);
        });
    }
}

function getStricterPrice(earlierPrice) {
    let tens = 10;
    let length = 0;
    if (earlierPrice.toString().includes("."))
        length = (earlierPrice + '').replace('.', '').length;  // for floats
    else
        length = Math.log(earlierPrice) * Math.LOG10E + 1 | 0;  // for positive integers

    for (let i = 0; i < length; i++) {
        let nearestMultipleOfTens = Math.ceil(earlierPrice / tens) * tens;
        let diff = nearestMultipleOfTens - earlierPrice
        let diffInPercent = (diff * 100) / earlierPrice;
        if (diffInPercent > 0 && diffInPercent < 1.00)
            return earlierPrice + diff;
        tens = tens * 10;
    }

    return earlierPrice;
}

function getNearestMultipleOf100(num) {
    let nearestMultiple = Math.ceil(num / 100) * 100; // get the nearest multiple of 100
    return nearestMultiple - num;
}

function getNearestMultipleOf10(num) {
    let nearestMultiple = Math.ceil(num / 10) * 10; // get the nearest multiple of 10
    return nearestMultiple - num;
}


function createHiddenEarlierPriceElement(earlierPrice, priceElement) {
    let span = document.createElement("span");
    span.style.display = 'none'
    span.setAttribute('id', 'affordable-budget');
    span.classList.add('budget-price');
    span.innerText = earlierPrice;
    priceElement.appendChild(span);

    priceElement.addEventListener('mouseover', function handleMouseOver() {
        span.style.display = 'block';

    });
    priceElement.addEventListener('mouseout', function handleMouseOut() {
        span.style.display = 'none';
    });
}

function addZerosToNumber(actualPrice, strictlyAdjustedPrice) {
    let decimalPlacesA = actualPrice.toString().split('.')[1];
    let decimalPlacesB = strictlyAdjustedPrice.toString().split('.')[1];

    if (decimalPlacesA && !decimalPlacesB) {
        let numZeros = decimalPlacesA.length;
        let zerosToAdd = '0'.repeat(numZeros);
        strictlyAdjustedPrice = strictlyAdjustedPrice.toString() + '.' + zerosToAdd;
    } else if (decimalPlacesA && decimalPlacesB && decimalPlacesA.length > decimalPlacesB.length) {
        let numZeros = decimalPlacesA.length - decimalPlacesB.length;
        let zerosToAdd = '0'.repeat(numZeros);
        strictlyAdjustedPrice = strictlyAdjustedPrice.toString() + zerosToAdd;
    }
    return strictlyAdjustedPrice;
}


function replaceDigitsFromRight(actualPrice, strictlyAdjustedPrice) {
    const aArray = actualPrice.replace(/,/g, '').split('');
    const bArray = strictlyAdjustedPrice.split('');

    // Remove currency symbol from aArray
    const currencyIndex = aArray.findIndex((char) => isNaN(parseInt(char, 10)));
    const aDigits = aArray.slice(currencyIndex + 1);

    // Iterate through A from right to left
    for (let i = aDigits.length - 1, j = bArray.length - 1; i >= 0; i--, j--) {
        if (!isNaN(parseInt(aDigits[i], 10))) {
            if (j >= 0) {
                aDigits[i] = bArray[j];
            } else {
                aDigits[i] = '0';
            }
        }
    }

    // Add any extra digits from B to the left of aDigits
    const extraDigits = bArray.slice(0, bArray.length - aDigits.length);
    const resultDigits = [...extraDigits, ...aDigits];

    // Add commas back to resultDigits
    const resultDigitsString = resultDigits.join('').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Add currency symbol back to result
    const result = actualPrice.slice(0, currencyIndex + 1) + resultDigitsString;

    // Handle decimal points
    const aDecimalIndex = actualPrice.indexOf('.');
    const bDecimalIndex = strictlyAdjustedPrice.indexOf('.');
    if (aDecimalIndex !== -1 && bDecimalIndex === aDecimalIndex) {
        const resultDecimalIndex = result.indexOf('.');
        if (resultDecimalIndex === -1) {
            return result + '.';
        } else if (resultDecimalIndex === result.length - 1) {
            return result + '0';
        }
    }

    return result;
}

function append(elementInfo, element, productPrice, settings, isPriceRange) {
    let priceElement = getElementByKey(element, elementInfo.setter)

    if (settings.strictPriceMode) {
        let stricterPrice = getStricterPrice(productPrice);
        if (stricterPrice !== productPrice && priceElement.getAttribute('id') !== "strict-mode") {
            stricterPrice = addZerosToNumber(priceElement.textContent, stricterPrice)
            let earlierPrice = priceElement.textContent;
            priceElement.textContent = replaceDigitsFromRight(earlierPrice, stricterPrice.toString()) + "~"
            priceElement.setAttribute('id', 'strict-mode');
            createHiddenEarlierPriceElement(earlierPrice, priceElement);
        }
    }

    if (settings.budget && productPrice > settings.budget) {
        // Show price as 'Out of Budget', reveal price on hover
        for (let i = 0; i < priceElement.children.length; i++) {
            let child = priceElement.children[i]
            if (child.getAttribute('id') === 'affordable-budget') {
                return;
            }
        }
        let earlierPrice = priceElement.textContent;
        priceElement.textContent = "Out of budget"
        priceElement.classList.add("budget-mode");
        createHiddenEarlierPriceElement(earlierPrice, priceElement);
        return;
    }

    let desiredElement = getElementByKey(element, elementInfo.setter);

    if (desiredElement.classList.contains("budget-mode") && !settings.budget) {
        // Budget-mode was reset, revert to original prices
        let earlierPrice;
        for (let i = 0; i < desiredElement.children.length; i++) {
            let child = priceElement.children[i]
            if (child.getAttribute('id') === 'affordable-budget') {
                earlierPrice = child.textContent;
                desiredElement.textContent = earlierPrice;
            }
        }
        return;
    }

    let span = document.createElement("span");
    span.setAttribute('id', 'affordable');
    desiredElement.appendChild(span);
    if (settings.hoverMode) {
        // Hover Mode Attributes
        span.style.display = 'none'
        if (settings.colourCodePrices) {
            addColourBasedOnPercentIntensity(span, getPriceInSalaryPercentage(productPrice, settings.salary) / 100)
        }
        span.innerText = " " + getAppendContent(productPrice, settings.salary, settings.percentageMode)
        element.addEventListener('mouseover', function handleMouseOver() {
            span.style.display = 'block';
        });
        desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
        element.addEventListener('mouseout', function handleMouseOut() {
            span.style.display = 'none';
        });

    } else {
        // Normal Mode Attributes
        let innerSpan = document.createElement("span")
        if (settings.colourCodePrices) {
            addColourBasedOnPercentIntensity(innerSpan, getPriceInSalaryPercentage(productPrice, settings.salary) / 100)
        }
        innerSpan.innerText = getAppendContent(productPrice, settings.salary, settings.percentageMode);
        span.appendChild(innerSpan)
        if (!isPriceRange) {
            span.setAttribute("style", "display:block");
            desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
        }
    }
}

function addColourBasedOnPercentIntensity(element, percent) {
    //value from 0 to 1
    if (percent > 1)
        percent = 1;
    var hue = ((1 - percent) * 120).toString(10);
    let backgroundColor = ["hsl(", hue, ",100%,50%)"].join("");
    element.style.color = backgroundColor;
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
    // let budgetElements = document.querySelectorAll('#affordable-budget');
    // budgetElements.forEach((element) => {
    //     let tempParentElement = element.parentElement;
    //     tempParentElement.removeChild(element);
    // })

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