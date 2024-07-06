/** @format */

const puppeteer = require("puppeteer");

async function run() {
    const browser = await puppeteer.launch({ headless: false }); // set to true for headless mode
    const page = await browser.newPage();

    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    while (attempts < maxRetries && !success) {
        try {
            await page.goto("https://cloud.eais.go.kr/", { timeout: 60000 });

            // Handle popup by waiting for it and then closing it
            await page.waitForSelector("selector-for-popup-close-button", {
                timeout: 10000,
            }); // Replace with actual selector
            await page.click("selector-for-popup-close-button"); // Replace with actual selector

            success = true;
        } catch (error) {
            console.error(`Attempt ${attempts + 1} failed: ${error.message}`);
            attempts++;
            if (attempts >= maxRetries) {
                throw new Error(
                    "Failed to navigate to the website after multiple attempts"
                );
            }
        }
    }

    // Perform the login
    await page.waitForSelector("#loginID");
    await page.type("#loginID", "kinsu83");
    await page.type("#loginPW", "kiminsu83!");
    await page.click("#loginButton");

    // Wait for login to complete and navigate back to the home page
    await page.waitForNavigation();

    // Click on "Issurance of Building Ledger"
    await page.click("selector-for-issurance-of-building-ledger");

    // Wait for the input field to be visible and input the address
    await page.waitForSelector("selector-for-address-input");
    await page.type(
        "selector-for-address-input",
        "경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]"
    );

    // Click the search button
    await page.click("selector-for-search-button");

    // Wait for the results to be visible
    await page.waitForSelector("selector-for-result-item");

    // Click on the result item to view details
    await page.click("selector-for-result-item");

    // Wait for the PDF download button to be visible and click it
    await page.waitForSelector("selector-for-pdf-download-button");
    await page.click("selector-for-pdf-download-button");

    // Wait for the download to start and complete
    await page.waitForSelector("selector-for-download-complete", {
        timeout: 30000,
    });

    // Close the browser
    await browser.close();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
