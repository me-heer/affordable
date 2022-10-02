const blacklistedClasses = ["a-row", "savingsPercentage"];

const elements = [
    {
        className: ".a-price",
        getter: ["firstChild", "textContent"],
        setter: ["lastChild"],
        elementGetter: ["firstChild"]
    },
    {
        className: ".a-color-price",
        getter: ["textContent"],
        setter: [],
        elementGetter: []
    }
]

main();

function main() {
    updateAllPrices();
    setInterval(updateAllPrices, refreshRateInMillis);
}

function updateAllPrices() {
    for (const elementInfo of elements) {
        updatePrice(elementInfo, blacklistedClasses)
    }
}

// TODO: Same for Flipkart
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