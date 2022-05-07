const blacklistedClasses = ["a-row", "savingsPercentage"];

const mainPrice = {
    getter: ["firstChild", "textContent"],
    setter: ["lastChild"]
}

main();




function main() {
    updateAllPrices();
    setInterval(updateAllPrices, refreshRateInMillis);
}

function updateAllPrices() {
    updateMainPrice(".a-price");
    updateColorPrice(".a-color-price");
}


function appendColorPrice(element, appendContent) {
    element.append(appendContent);
}

function appendMainPrice(element, appendContent) {
    element.lastChild.append(appendContent);
}


function updateMainPrice(className) {
    let elements = document.querySelectorAll(className);
    elements.forEach((element) => {
        let productPrice = currency(element.firstChild.textContent).value;

        let testElement = element;
        for (const getterKey of mainPrice.getter) {
            testElement = testElement[getterKey.toString()]
        }

        if (isValid(productPrice, element, blacklistedClasses)) {
            getFromStorageSync("salary", ({salary}) => {
                appendMainPrice(element, getAppendContent(productPrice, salary));
            })
        }

    });
}

function updateColorPrice(className) {
    let elements = document.querySelectorAll(className);
    elements.forEach((element) => {
        let productPrice = currency(element.textContent).value;
        if (isValid(productPrice, element, blacklistedClasses)) {
            getFromStorageSync("salary", ({salary}) => {
                appendColorPrice(element, getAppendContent(productPrice, salary));
            });
        }
    });
}