/** @format */

const puppeteer = require("puppeteer");

async function run() {
    const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
    const page = await browser.newPage();

    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    while (attempts < maxRetries && !success) {
        try {
            await page.goto("https://cloud.eais.go.kr/", { timeout: 60000 });

            // Handle popup by waiting for the close button and then clicking it
            await page.waitForSelector('button:contains("닫기")', {
                timeout: 10000,
            });
            await page.click('button:contains("닫기")');

            // Wait for the login button to appear and click it
            await page.waitForSelector("button.login-btn", { timeout: 10000 }); // Replace with the actual selector for the login button
            await page.click("button.login-btn");

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
    await page.waitForSelector("#membId");
    await page.type("#membId", "kinsu83");
    await page.type("#pwd", "kiminsu83!");
    await page.click("button.login-submit"); // Replace with the actual selector for the login submit button

    // Wait for login to complete and navigate back to the home page
    await page.waitForNavigation();

    // Scroll to find the element with class name `bldre1` and click on `Issurance of Building Ledger`
    await page.waitForSelector(".bldre1");
    await page.evaluate(() => {
        const elements = document.querySelectorAll(".bldre1");
        elements.forEach((element) => {
            if (
                element.textContent.includes("Insurance of Building register")
            ) {
                element.click();
            }
        });
    });

    // Wait for the input field to be visible and input the address
    await page.waitForSelector("selector-for-address-input"); // Replace with actual selector
    await page.type(
        "selector-for-address-input",
        "경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]"
    ); // Replace with actual address input

    // Click the search button
    await page.click("selector-for-search-button"); // Replace with actual selector

    // Wait for the results to be visible
    await page.waitForSelector("selector-for-result-item"); // Replace with actual selector

    // Click on the result item to view details
    await page.click("selector-for-result-item"); // Replace with actual selector

    // Wait for the PDF download button to be visible and click it
    await page.waitForSelector("selector-for-pdf-download-button"); // Replace with actual selector
    await page.click("selector-for-pdf-download-button"); // Replace with actual selector

    // Wait for the download to start and complete
    await page.waitForSelector("selector-for-download-complete", {
        timeout: 30000,
    }); // Replace with actual selector

    // Close the browser
    await browser.close();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
