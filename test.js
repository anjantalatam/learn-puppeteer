const puppeteer = require("puppeteer");

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//   });
//   const page = await browser.newPage();

//   const lastPage =
//     "https://www.amazon.in/s?k=laptop+desk+and+water+bottle+and+flower+pot+and+water+can&page=2";
//   const url =
//     "https://www.amazon.in/s?k=laptop+desk+and+water+bottle+and+flower+pot+and+water+can";

//   await page.goto(url);

//   const isDisabled =
//     (await page.$(
//       ".s-pagination-item.s-pagination-next.s-pagination-disabled"
//     )) !== null;

//   console.log(isDisabled);

//   await browser.close();
// })();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  const url1 =
    "https://www.amazon.in/s?k=laptop+desk+and+water+bottle+and+flower+pot+and+water+can&page=2";
  const url2 =
    "https://www.amazon.in/s?k=laptop+desk+and+water+bottle+and+flower+pot+and+water+can";

  await page.goto(url2);

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

  console.log(items.length);
})();
