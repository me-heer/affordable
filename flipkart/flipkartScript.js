const blacklistedClasses = [];
main();

function main() {
    updateAllPrices();
    setInterval(updateAllPrices, refreshRateInMillis);
}

function updateAllPrices() {
    updateMainPrice("._30jeq3");
}

function appendMainPrice(element, appendContent) {
    element.append(appendContent);
}


function updateMainPrice(className) {
    let elements = document.querySelectorAll(className);

    elements.forEach((element) => {

        let productPrice = currency(element.textContent).value;
        if (isValid(productPrice, element, blacklistedClasses)) {
            getFromStorageSync("salary", ({salary}) => {
                appendMainPrice(element, getAppendContent(productPrice, salary));
            });
        }
    });
}

