/** @format */

const puppeteer = require("puppeteer");

async function run() {
    const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
    const page = await browser.newPage();

    try {
        await page.goto("https://cloud.eais.go.kr/", { timeout: 60000 });

        // Wait for the popup to appear and close it
        await page.waitForSelector('button:contains("닫기")', {
            timeout: 10000,
        });
        await page.click('button:contains("닫기")');

        // Wait for the login button to appear and click it
        await page.waitForSelector('a[href="/login"]', { timeout: 10000 });
        await page.click('a[href="/login"]');

        // Wait for the login form to appear and fill it in
        await page.waitForSelector("#membId", { timeout: 10000 });
        await page.type("#membId", "kinsu83");
        await page.type("#pwd", "kiminsu83!");
        await page.click('button[type="submit"]'); // Assuming the login button is of type submit

        // Wait for the navigation after login
        await page.waitForNavigation();

        // Navigate back to the homepage by clicking on the logo
        await page.waitForSelector("img.logo"); // Replace with the actual selector for the logo
        await page.click("img.logo");

        // Click on "Issurance of Building Ledger"
        await page.waitForSelector('a[href="/building-ledger"]', {
            timeout: 10000,
        }); // Replace with the actual selector
        await page.click('a[href="/building-ledger"]');

        // Wait for the input field to be visible and input the address
        await page.waitForSelector("input.address-input"); // Replace with the actual selector for the address input
        await page.type(
            "input.address-input",
            "경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]"
        );

        // Click the search button
        await page.click("button.search-button"); // Replace with the actual selector for the search button

        // Wait for the results to be visible
        await page.waitForSelector(".result-item"); // Replace with the actual selector for the result item

        // Click on the result item to view details
        await page.click(".result-item"); // Replace with the actual selector for the result item

        // Wait for the PDF download button to be visible and click it
        await page.waitForSelector("button.download-pdf"); // Replace with the actual selector for the PDF download button
        await page.click("button.download-pdf");

        // Wait for the download to start and complete
        await page.waitForSelector("selector-for-download-complete", {
            timeout: 30000,
        });

        console.log("PDF downloaded successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        await browser.close();
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
