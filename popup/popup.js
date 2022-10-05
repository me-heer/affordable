function populateDefaultValues() {
    chrome.storage.sync.get("settings", ({settings}) => {
        const currentSalary = settings.salary;
        console.log(settings.salary);
        let salaryValue = document.getElementById('salary')
        salaryValue.setAttribute('value', currentSalary)

        const hoverMode = settings.hoverMode;
        let hoverModeToggle = document.getElementById('hoverModeToggle')
        if (hoverMode === true) {
            hoverModeToggle.setAttribute('checked', 'checked')
        }
    });
}

function sendMessage() {
    try {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "undo"});
        });
    } catch (e) {
        console.log("Failed to send undo message. Desired webpage may not be open right now.")
    }
}

function updateSalary() {
    let salaryValue = document.getElementById("salary").value;
    chrome.storage.sync.get("settings", ({settings}) => {
        settings.salary = salaryValue
        chrome.storage.sync.set({settings})
    })

    let salaryUpdatedStatusText = document.getElementById('salary_updated_status')
    salaryUpdatedStatusText.hidden = false;
    salaryUpdatedStatusText.textContent = `Updated salary: ${salaryValue}`
    sendMessage();
}

function updateSalaryWhenDoneTyping() {
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

function updateHoverMode() {
    let hoverModeToggle = document.getElementById('hoverModeToggle');
    hoverModeToggle.addEventListener('change', () => {
        console.log("HOVER MODE: {}", hoverModeToggle.checked)
        console.log("Settings changed, sending message")
        chrome.storage.sync.get("settings", ({settings}) => {
            settings.hoverMode = hoverModeToggle.checked
            chrome.storage.sync.set({settings});
        })
        sendMessage()
    });
}


populateDefaultValues();
updateSalaryWhenDoneTyping();
updateHoverMode();

