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
        return `${percentage}%`
    }
    let timeTakenToEarn = getTimeTakenToEarn(productPrice, salary);
    return `${timeTakenToEarn}`
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
    // Remove any existing budget-price element to avoid duplicates
    let existingBudgetPrice = priceElement.querySelector('.budget-price');
    if (existingBudgetPrice) {
        existingBudgetPrice.remove();
    }

    let span = document.createElement("span");
    span.setAttribute('id', 'affordable-budget');
    span.classList.add('budget-price');
    span.innerText = earlierPrice;
    priceElement.appendChild(span);
    
    // Position tooltip on hover using fixed positioning
    const positionTooltip = () => {
        const rect = priceElement.getBoundingClientRect();
        const tooltipRect = span.getBoundingClientRect();
        
        // Position above the element, centered
        const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        const top = rect.top - tooltipRect.height - 8; // 8px gap
        
        span.style.left = `${left}px`;
        span.style.top = `${top}px`;
    };
    
    // Update position on hover
    priceElement.addEventListener('mouseenter', positionTooltip);
    
    // Also update on scroll to keep it positioned correctly
    let scrollTimeout;
    const handleScroll = () => {
        if (priceElement.matches(':hover')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(positionTooltip, 10);
        }
    };
    window.addEventListener('scroll', handleScroll, true);
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
            // Store original price in data attribute for easier access
            priceElement.setAttribute('data-original-price', earlierPrice);
            // Replace price with stricter price
            priceElement.textContent = replaceDigitsFromRight(earlierPrice, stricterPrice.toString());
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

    // Remove any existing affordable badges from this element to prevent duplicates
    let existingBadges = desiredElement.querySelectorAll('#affordable');
    existingBadges.forEach(badge => badge.remove());
    
    // Also check parent element for adjacent sibling badges (in case badges were added to adjacent elements)
    if (desiredElement.parentElement) {
        let siblings = Array.from(desiredElement.parentElement.children);
        let desiredIndex = siblings.indexOf(desiredElement);
        
        // Check adjacent siblings (previous and next)
        if (desiredIndex > 0) {
            let prevSibling = siblings[desiredIndex - 1];
            let prevBadges = prevSibling.querySelectorAll('#affordable');
            prevBadges.forEach(badge => {
                // Only remove if it's a direct child (adjacent span tag)
                if (badge.parentElement === prevSibling) {
                    badge.remove();
                }
            });
        }
        
        if (desiredIndex < siblings.length - 1) {
            let nextSibling = siblings[desiredIndex + 1];
            let nextBadges = nextSibling.querySelectorAll('#affordable');
            nextBadges.forEach(badge => {
                // Only remove if it's a direct child (adjacent span tag)
                if (badge.parentElement === nextSibling) {
                    badge.remove();
                }
            });
        }
    }

    // Build badge
    let badge = document.createElement("span");
    badge.setAttribute('id', 'affordable');
    badge.className = 'affordable-badge';

    let swatch = document.createElement("span");
    swatch.className = 'affordable-badge__swatch';

    // Always enable colorization based on price
    const percent = computeAffordabilityPercent(productPrice, settings.salary);
    const tier = percentToTier(percent);
    swatch.classList.add(`aff-tier-${tier}`);

    let text = document.createElement("span");
    text.className = 'affordable-badge__text';
    text.innerText = getAppendContent(productPrice, settings.salary, settings.percentageMode);

    badge.appendChild(swatch);
    badge.appendChild(text);
    desiredElement.appendChild(badge);

    if (settings.hoverMode) {
        // Hover Mode - use CSS classes for visibility control
        badge.classList.add('hover-mode');
        desiredElement.classList.add('affordable-hover-container');
        desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
    } else if (!isPriceRange) {
        badge.setAttribute("style", "display:inline-flex");
        desiredElement.setAttribute("title", `It will take you ${getTimeTakenToEarn(productPrice, settings.salary)} to earn ${productPrice}`);
    }
}

function computeAffordabilityPercent(productPrice, salary) {
    let percent = productPrice / salary;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    return percent;
}

function percentToTier(percent) {
    let p = percent;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    return Math.round(p * 10);
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

    elements = document.querySelectorAll(".affordable-hover-container")
    elements.forEach((element) => {
        element.classList.remove("affordable-hover-container")
    })

}