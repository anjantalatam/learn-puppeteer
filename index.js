const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.in/s?k=laptop+desk");

  const products = await page.$$(
    "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );

  const items = [];

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
        (el) => el.querySelector("span.a-price > span.a-offscreen").textContent,
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

  console.log(items);
})();
