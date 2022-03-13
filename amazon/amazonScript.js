// TODO: Update when page URL is updated
// TODO: Listen to extension updates

// Normal Price
updatePriceForElement("#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)");

// Deal Price
updatePriceForElement("#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePriceToPayPadding.priceToPay > span:nth-child(2) > span.a-price-whole");

/* Comparison Table */
updatePriceForElement("#HLCXComparisonTable > tbody > tr:nth-child(2) > td:nth-child(2) > span")
updatePriceForElement("#HLCXComparisonTable > tbody > tr:nth-child(2) > td.price-column.comparable_item0 > span")
updatePriceForElement("#HLCXComparisonTable > tbody > tr:nth-child(2) > td.price-column.comparable_item1 > span")
updatePriceForElement("#HLCXComparisonTable > tbody > tr:nth-child(2) > td.price-column.comparable_item2 > span")



/* Featured Items You May Like Carousel */
// TODO: Fix Formatting, update prices when carousel updates
// 1. Normal Prices
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(1) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(2) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(3) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(4) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(5) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(6) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(7) > div > div:nth-child(4) > a > span > span:nth-child(2) > span.a-price-whole")
// 2. Deal Prices
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(1) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(2) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(3) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(4) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(5) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(6) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")
updatePriceForElement("#anonCarousel9 > ol > li:nth-child(7) > div > div:nth-child(5) > a > span.a-price > span:nth-child(2) > span.a-price-whole")


function updatePriceForElement(xpathStringOfElement) {
  waitForElm(xpathStringOfElement).then((element) => {
    appendDays(element);
  });
}

function appendDays(element) {
  //TODO: Check if currency symbol exists (by checking if it's number or not)
  let dealPrice = parseFloat(
    new String(element.innerHTML).substring(1).replace(",", "")
  );
  console.log("PRICE: " + dealPrice);
  chrome.storage.sync.get("salary", ({ salary }) => {
    console.log(salary);
    let timeTakenToEarn = parseInt(dealPrice * (30 / salary));
    element.append(` | ${timeTakenToEarn} days`);
  });
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}