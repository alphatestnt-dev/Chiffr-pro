import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.CHIFRECO_URL || "http://127.0.0.1:4173/";
const expected = { direct: 48, ht: 64, ttc: 76.8 };
const results = [];
const browser = await chromium.launch({ headless: true });

try {
  const androidSource = await readFile(
    "android/app/src/main/java/fr/chiffrecopro/app/MainActivity.java",
    "utf8"
  );

  // Guard the core design: Android must load the same website, not a forked calculator.
  assert.match(androidSource, /loadUrl\(["']https:\/\/chiffreco-pro\.fr\//);
  assert.match(androidSource, /setJavaScriptEnabled\(true\)/);
  assert.match(androidSource, /setDomStorageEnabled\(true\)/);
  assert.match(androidSource, /ServiceWorkerController[\s\S]*setCacheMode\(WebSettings\.LOAD_NO_CACHE\)/);

  const profiles = [
    { name: "desktop", viewport: { width: 1365, height: 900 }, isMobile: false },
    { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true }
  ];

  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      isMobile: profile.isMobile,
      hasTouch: profile.isMobile
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    assert.ok(response && response.ok(), `Website response failed on ${profile.name}`);
    await page.waitForFunction(() => typeof window.calc === "function" && typeof window.ceBarometre === "function" && window.makeQuote?.name === "createQuote" && typeof window.cePartPrepareQuote === "function", { timeout: 30000 });
    const runtimeScriptCount = await page.locator('script[src*="runtime-stability.js"]').count();
    const docsScriptCount = await page.locator('script[src*="documents-v2.js"]').count();
    assert.equal(runtimeScriptCount, 1, `${profile.name}: runtime-stability.js loaded ${runtimeScriptCount} times`);
    assert.equal(docsScriptCount, 1, `${profile.name}: documents-v2.js loaded ${docsScriptCount} times`);
    await page.locator('nav button[data-p="pro"]').click();
    await page.locator("#hours").fill("3");
    await page.locator("#rate").fill("16");
    await page.locator("#travel").fill("0");
    await page.locator("#other").fill("0");
    await page.locator("#margin").fill("25");
    await page.locator("#vat").fill("20");
    await page.locator("#qty").fill("0");
    await page.locator("#unit").selectOption("forfait");

    const result = await page.evaluate(() => {
      const value = window.calc();
      return {
        origin: location.origin,
        direct: value.direct,
        ht: value.ht,
        ttc: value.ttc,
        displayedCost: document.querySelector("#cost")?.textContent?.trim(),
        displayedHt: document.querySelector("#ht")?.textContent?.trim(),
        displayedTtc: document.querySelector("#ttc")?.textContent?.trim(),
        hours: value.hours,
        rate: value.rate,
        materials: value.materials,
        tools: value.tools,
        wastes: value.wastes,
        travel: Number(document.querySelector("#travel").value),
        other: Number(document.querySelector("#other").value),
        qty: value.qty,
        unit: value.unit,
        barometerCoefficient: value.barometerCoefficient
      };
    });

    console.log("Calculator diagnostic:", JSON.stringify(result));
    assert.equal(result.origin, new URL(baseUrl).origin);
    assert.ok(Math.abs(result.direct - expected.direct) < 0.001, `${profile.name}: wrong direct cost ${result.direct}`);
    assert.ok(Math.abs(result.ht - expected.ht) < 0.001, `${profile.name}: wrong HT total ${result.ht}`);
    assert.ok(Math.abs(result.ttc - expected.ttc) < 0.001, `${profile.name}: wrong TTC total ${result.ttc}`);
    assert.ok(result.displayedCost, `${profile.name}: total cost is not displayed`);
    assert.ok(result.displayedHt, `${profile.name}: HT total is not displayed`);
    assert.ok(result.displayedTtc, `${profile.name}: TTC total is not displayed`);

    // The PRO barometer must not lower the total when quantity increases.
    await page.locator("#qty").fill("2");
    await page.locator("#unit").selectOption("m²");
    const proTotalForTwo = await page.evaluate(() => window.calc().direct);
    await page.locator("#qty").fill("4");
    const proTotalForFour = await page.evaluate(() => window.calc().direct);
    assert.ok(proTotalForFour >= proTotalForTwo, `${profile.name}: PRO total fell from quantity 2 to 4 (${proTotalForTwo} -> ${proTotalForFour})`);

    // The quote must snapshot the same adjusted labor and total as the calculator.
    await page.locator("#qty").fill("0");
    await page.locator("#unit").selectOption("forfait");
    const stableCalculation = await page.evaluate(() => window.calc());
    const quoteData = await page.evaluate(() => window.makeQuote().data);
    assert.equal(quoteData.labor, stableCalculation.labor, `${profile.name}: quote labor differs from calculator labor`);
    assert.equal(quoteData.barometerCoefficient, stableCalculation.barometerCoefficient, `${profile.name}: quote coefficient differs from calculator`);
    assert.equal(quoteData.ht, await page.locator("#ht").textContent().then(value => value.trim()), `${profile.name}: quote HT differs from calculator`);
    assert.equal(await page.locator("#rate").inputValue(), "16", `${profile.name}: calculator unexpectedly changed the visible hourly rate`);

    // Reset must clear only the in-progress estimate without reloading the WebView.
    await page.evaluate(() => {
      const originalConfirm = window.confirm;
      window.confirm = () => true;
      document.querySelector("#qty").value = "9";
      document.querySelector("#hours").value = "7";
      window.resetAll();
      window.confirm = originalConfirm;
    });
    assert.equal(await page.locator("#qty").inputValue(), "1", `${profile.name}: reset did not restore quantity`);
    assert.equal(await page.locator("#hours").inputValue(), "3", `${profile.name}: reset did not restore hours`);
    assert.ok((await page.locator("#res").getAttribute("class")).includes("hide"), `${profile.name}: reset left the old calculation visible`);

    // Regression check for the report that increasing quantity can lower an estimate.
    await page.evaluate(() => {
      document.querySelectorAll(".page").forEach(section => section.classList.remove("active"));
      document.getElementById("particulier").classList.add("active");
    });
    await page.waitForSelector("#pq", { state: "visible", timeout: 10000 });
    const estimateRange = async quantity => {
      await page.locator("#pq").fill(String(quantity));
      const estimateDebug = await page.evaluate(async () => {
        const type = typeof window.estimate;
        if (type === "function") await window.estimate();
        return {
          type,
          quantity: document.querySelector("#pq")?.value,
          branch: document.querySelector("#pf")?.value,
          difficulty: document.querySelector("#pd")?.value,
          state: document.querySelector("#pe")?.value,
          range: document.querySelector("#range")?.textContent || "",
          resultClass: document.querySelector("#pr")?.className
        };
      });
      console.log("Private estimate diagnostic:", JSON.stringify(estimateDebug));
      const text = estimateDebug.range;
      const values = [...text.matchAll(/([\d\s\u00a0.,]+)\s*€/g)]
        .map(match => Number(match[1].replace(/[\s\u00a0]/g, "").replace(",", ".")));
      assert.equal(values.length, 2, `${profile.name}: could not parse estimate range: ${text}`);
      return values;
    };
    const rangeForOne = await estimateRange(1);
    const rangeForSix = await estimateRange(6);
    assert.ok(rangeForSix[0] > rangeForOne[0], `${profile.name}: minimum estimate did not increase with quantity`);
    assert.ok(rangeForSix[1] > rangeForOne[1], `${profile.name}: maximum estimate did not increase with quantity`);

    assert.deepEqual(pageErrors, [], `${profile.name}: uncaught JavaScript errors: ${pageErrors.join("; ")}`);
    results.push({ profile: profile.name, direct: result.direct, ht: result.ht, ttc: result.ttc, estimate1: rangeForOne, estimate6: rangeForSix });
    await context.close();
  }

  assert.deepEqual(
    { direct: results[0].direct, ht: results[0].ht, ttc: results[0].ttc },
    { direct: results[1].direct, ht: results[1].ht, ttc: results[1].ttc },
    "Mobile and desktop calculations differ"
  );

  console.log("PASS: Android wrapper targets the shared site and disables HTTP/service-worker cache.");
  console.log("PASS: same known estimate on desktop and mobile:", JSON.stringify(results));
  console.log("PASS: increasing the private estimate quantity from 1 to 6 increases both bounds.");
} finally {
  await browser.close();
}
