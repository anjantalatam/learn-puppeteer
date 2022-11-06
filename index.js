const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  const url =
    "https://www.amazon.in/s?k=laptop+desk+and+water+bottle+and+flower+pot+and+water+can";

  await page.goto(url);

  const items = [];

  let isNextDisabled = false;

  while (!isNextDisabled) {
    const productsSelector =
      "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item";

    const nextButtonSelector = ".s-pagination-item.s-pagination-next";
    const nextDisabledSelector = `${nextButtonSelector}.s-pagination-disabled`;

    await page.waitForSelector(nextButtonSelector, { visible: true });

    const products = await page.$$(productsSelector);

    for (const product of products) {
      let title = "Null";
      let price = "Null";
      let imgUrl = "Null";

      try {
        title = await page.evaluate(
          (el) => el.querySelector("h2 > a > span").textContent,
          product
        );
      } catch (e) {}

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector("span.a-price > span.a-offscreen").textContent,
          product
        );
      } catch (e) {}

      try {
        imgUrl = await page.evaluate(
          (el) => el.querySelector(".s-image").getAttribute("src"),
          product
        );
      } catch (e) {}

      if (title !== "Null") {
        items.push({ title, price, imgUrl });
      }
    }

    isNextDisabled = (await page.$(nextDisabledSelector)) !== null;

    if (!isNextDisabled) {
      page.click(nextButtonSelector);
      await page.waitForNavigation({ waitUntil: "load" });
    }
  }

  console.log(items, items.length);
})();
