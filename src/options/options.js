function populateDefaultValues() {
    chrome.storage.sync.get("settings", ({ settings }) => {
        const currentSalary = settings.salary;
        let salaryValue = document.getElementById('salary')
        salaryValue.setAttribute('value', currentSalary)

        const hoverMode = settings.hoverMode;
        let hoverModeToggle = document.getElementById('hoverModeToggle')
        if (hoverMode === true) {
            hoverModeToggle.setAttribute('checked', 'checked')
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
    });
}

function sendMessage() {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "undo" }, (result) => {
            if (chrome.runtime.lastError) {
                // Handle last error
                console.log("Failed to send undo message. Desired webpage may not be open right now.")
            }
        });
    });
}

function updateSalary() {
    let salaryValue = document.getElementById("salary").value;
    chrome.storage.sync.get("settings", ({ settings }) => {
        settings.salary = salaryValue
        chrome.storage.sync.set({ settings })
    })

    let salaryUpdatedStatusText = document.getElementById('salary_updated_status')
    salaryUpdatedStatusText.hidden = false;
    salaryUpdatedStatusText.textContent = `Updated salary: ${salaryValue}`
    sendMessage();
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
    let result = getTimeTakenToEarn(customPriceInput, document.getElementById("salary").value)
    customPriceResult.textContent = `${result}`
}

populateDefaultValues();
addSalaryUpdateListener();
addHoverModeUpdateListener();
addDisableExtensionListener();
addColourCodePriceListener();
addResultUpdateListener();