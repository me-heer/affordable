let updateSalaryBtn = document.getElementById("updateSalary");

// When the button is clicked, inject setPageBackgroundColor into current page
updateSalaryBtn.addEventListener("click", async () => {
  //   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let salaryValue = document.getElementById("salary").value;
  chrome.storage.sync.set({ salary: salaryValue });
  console.log(`Updated salary: ${salaryValue}`)

  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: setPageBackgroundColor,
  //   });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
