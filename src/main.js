function parseWebsite() {
    currentUrl = window.location.toString();
    let ecommerce;
    if (currentUrl.includes('amazon'))
        ecommerce = amazon;
    else if (currentUrl.includes('flipkart'))
        ecommerce = flipkart
    return ecommerce;
}

function updateAllPrices() {
    let ecommerce = parseWebsite();

    for (const elementInfo of ecommerce.elements) {
        updatePrice(elementInfo, ecommerce.blacklistedClasses)
    }
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "undo") {
            undoUpdates()
        }
    }
);

function main() {
    updateAllPrices();
    setInterval(updateAllPrices, refreshRateInMillis);
}

main();