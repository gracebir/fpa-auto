/** @format */

const puppeteer = require("puppeteer");

async function run() {
    const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
    const page = await browser.newPage();

    try {
        await page.goto("https://cloud.eais.go.kr/", { timeout: 60000 });

        // Handle popup by waiting for it and then closing it
        await page.waitForSelector('button:contains("닫기")', {
            timeout: 10000,
        });
        await page.click('button:contains("닫기")');

        // Click on the login button
        await page.waitForSelector(".btnLogin");
        await page.click(".btnLogin");

        // Perform the login
        await page.waitForSelector("#membId");
        await page.type("#membId", "kinsu83");
        await page.type("#pwd", "kiminsu83!");
        await page.click(".btnLogin");

        // Wait for login to complete and navigate back to the home page
        await page.waitForNavigation();

        // Scroll to find and click on "Insurance of Building Register"
        await page.evaluate(() => {
            document.querySelector(".bldre1").scrollIntoView();
        });
        await page.waitForSelector(".bldre1");
        await page.click(".bldre1");

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
    } catch (error) {
        console.error(error);
        await browser.close();
        process.exit(1);
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
