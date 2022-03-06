let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

function getProductPrice() {
  console.log("getting product price");
  let dealPrice = document.querySelector(
    "#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)"
  );
  if(dealPrice)
    dealPrice.innerHTML = 0;
  let normalPrice = document.querySelector(
      "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePriceToPayPadding.priceToPay > span:nth-child(2) > span.a-price-whole"
  );
  if(normalPrice)
    normalPrice.innerHTML = 0;
}

chrome.webNavigation.onDOMContentLoaded.addListener(async () => {
  let tab = await getCurrentTab();
  console.log("got current tab");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getProductPrice,
  });
});

async function getCurrentTab() {
  console.log("getting current tab");
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
