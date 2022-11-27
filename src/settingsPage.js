function populateDefaultValues(optionsPage) {
    chrome.storage.sync.get("settings", ({ settings }) => {
        const currentSalary = settings.salary;
        let salaryValue = document.getElementById('salary')
        salaryValue.setAttribute('value', currentSalary)

        const hoverMode = settings.hoverMode;
        let hoverModeToggle = document.getElementById('hoverModeToggle')
        if (hoverMode === true) {
            hoverModeToggle.setAttribute('checked', 'checked')
        }

        if (!optionsPage) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                let disableForThisSiteText = document.getElementById('disableForThisSiteText')
                const currentUrl = new URL(tabs[0].url);
                disableForThisSiteText.textContent = `${currentUrl.hostname}`
                let disableForThisSiteToggle = document.getElementById('disableForThisSiteToggle')
                if (settings.disabledSites.includes(currentUrl.hostname)) {
                    disableForThisSiteToggle.setAttribute('checked', 'checked')
                }
            });
        }

        let disableExtensionToggle = document.getElementById('disableExtensionToggle')
        const disabled = settings.disabled
        if (disabled === true) {
            disableExtensionToggle.setAttribute('checked', 'checked')
        }

        const colourCodePrices = settings.colourCodePrices;
        let colourCodeToggle = document.getElementById('colourCodeToggle')
        if (colourCodePrices === true) {
            colourCodeToggle.setAttribute('checked', 'checked')
        }

        const percentageMode = settings.percentageMode;
        let percentageModeToggle = document.getElementById('percentageModeToggle')
        if (percentageMode === true) {
            percentageModeToggle.setAttribute('checked', 'checked')
        }

        const budget = settings.budget;
        let budgetElement = document.getElementById('budget')
        budgetElement.setAttribute('value', budget)
    });
}

function sendMessage() {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        console.log("TABS: ", tabs)
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "undo" }, (result) => {
            if (chrome.runtime.lastError) {
                // Handle last error
                console.log("Failed to send undo message. Desired webpage may not be open right now.")
                console.log("Error: ", chrome.runtime.lastError)
            }
        });
    });
}

function updateSalary() {
    let salaryValue = document.getElementById("salary").value;
    if (salaryValue > 0) {
        chrome.storage.sync.get("settings", ({ settings }) => {
            settings.salary = salaryValue
            chrome.storage.sync.set({ settings })
        })

        let salaryUpdatedStatusText = document.getElementById('salary_updated_status')
        salaryUpdatedStatusText.hidden = false;
        salaryUpdatedStatusText.textContent = `Updated salary: ${salaryValue}`
        sendMessage();
    }
}

function addSalaryUpdateListener() {
    //setup before functions
    let typingTimer;                //timer identifier
    let doneTypingInterval = 500;  //time in ms (5 seconds)
    let salaryInput = document.getElementById('salary');

    //on keyup, start the countdown
    salaryInput.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        if (salaryInput.value) {
            typingTimer = setTimeout(updateSalary, doneTypingInterval);
        }
    });
}

function updateBudget() {
    let budgetValue = document.getElementById("budget").value;
    if (budgetValue === "" || budgetValue > 0) {
        chrome.storage.sync.get("settings", ({ settings }) => {
            settings.budget = budgetValue
            chrome.storage.sync.set({ settings });
        })

        let budgetUpdatedStatusText = document.getElementById('budget_updated_status')
        budgetUpdatedStatusText.hidden = false;
        if (budgetValue === "") {
            budgetUpdatedStatusText.textContent = `Successfully removed budget. Please refresh the page.`
        } else {
            budgetUpdatedStatusText.textContent = `Updated budget: ${budgetValue}.`
        }
        sendMessage();
    }
}

function addBudgetUpdateListener() {
    //setup before functions
    let typingTimer;                //timer identifier
    let doneTypingInterval = 500;  //time in ms (5 seconds)
    let budgetInput = document.getElementById('budget');

    //on keyup, start the countdown
    budgetInput.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
        if (budgetInput.value) {
            typingTimer = setTimeout(updateBudget, doneTypingInterval);
        }
    });
}

function addHoverModeUpdateListener() {
    let hoverModeToggle = document.getElementById('hoverModeToggle');
    hoverModeToggle.addEventListener('change', () => {
        chrome.storage.sync.get("settings", ({ settings }) => {
            settings.hoverMode = hoverModeToggle.checked
            chrome.storage.sync.set({ settings });
        })
        sendMessage()
    });
}


function addDisableForThisSiteUpdateListener() {
    let disableForThisSiteToggle = document.getElementById('disableForThisSiteToggle');
    disableForThisSiteToggle.addEventListener('change', () => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.storage.sync.get("settings", ({ settings }) => {
                disabledSites = settings.disabledSites
                const currentUrl = new URL(tabs[0].url);
                if (disableForThisSiteToggle.checked) {
                    // add site
                    disabledSites.push(currentUrl.hostname)
                } else {
                    // remove site
                    disabledSites = disabledSites.filter(item => item !== currentUrl.hostname)
                }
                settings.disabledSites = disabledSites
                chrome.storage.sync.set({ settings });
            })
            sendMessage()
        });
    });
}

function addDisableExtensionListener() {
    let disableExtensionToggle = document.getElementById('disableExtensionToggle');
    disableExtensionToggle.addEventListener('change', () => {

        chrome.storage.sync.get("settings", ({ settings }) => {
            settings.disabled = disableExtensionToggle.checked
            chrome.storage.sync.set({ settings });
        })
        sendMessage()
    });
}

function addColourCodePriceListener() {
    let colourCodeToggle = document.getElementById('colourCodeToggle');
    colourCodeToggle.addEventListener('change', () => {

        chrome.storage.sync.get("settings", ({ settings }) => {
            settings.colourCodePrices = colourCodeToggle.checked
        })
        sendMessage()
    });
}

function addPercentageModeListener() {
    let percentageModeToggle = document.getElementById('percentageModeToggle');
    percentageModeToggle.addEventListener('change', () => {

        chrome.storage.sync.get("settings", ({ settings }) => {
            settings.percentageMode = percentageModeToggle.checked
            chrome.storage.sync.set({ settings });
        })
        sendMessage()
    });
}

function addResultUpdateListener() {
    //setup before functions
    let typingTimer;                //timer identifier
    let doneTypingInterval = 100;  //time in ms (5 seconds)
    let customPriceInput = document.getElementById('custom_price');

    //on keyup, start the countdown
    customPriceInput.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        if (customPriceInput.value) {
            typingTimer = setTimeout(updateResult, doneTypingInterval);
        }
    });
}

function updateResult() {
    let customPriceInput = document.getElementById("custom_price").value;
    let customPriceResult = document.getElementById('custom_price_result')
    customPriceResult.hidden = false;
    let salary = document.getElementById("salary").value
    let result = getTimeTakenToEarn(customPriceInput, salary)
    let percentage = getPriceInSalaryPercentage(customPriceInput, salary);
    customPriceResult.innerHTML = `Takes ${result} to earn. <br> ${percentage}% of your income.`
}
