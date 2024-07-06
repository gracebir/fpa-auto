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
            await page.waitForSelector(".btnClose", { timeout: 10000 });
            await page.click(".btnClose"); // Click the close button on the popup

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

    // Scroll and click on "Insurance of Building Register"
    await page.waitForSelector(".bldre1");
    await page.evaluate(() => {
        document.querySelector(".bldre1").scrollIntoView();
    });
    await page.click(".bldre1");

    // Wait for the input field to be visible and input the address
    await page.waitForSelector('input[placeholder="Search address"]'); // Adjust the selector as needed
    await page.type(
        'input[placeholder="Search address"]',
        "경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]"
    );

    // Click the search button
    await page.click('button[title="Search"]'); // Adjust the selector as needed

    // Wait for the results to be visible
    await page.waitForSelector(".result-item"); // Adjust the selector as needed

    // Click on the result item to view details
    await page.click(".result-item"); // Adjust the selector as needed

    // Wait for the PDF download button to be visible and click it
    await page.waitForSelector('button[title="Download PDF"]'); // Adjust the selector as needed
    await page.click('button[title="Download PDF"]');

    // Wait for the download to start and complete
    await page.waitForSelector(".download-complete", { timeout: 30000 }); // Adjust the selector as needed

    // Close the browser
    await browser.close();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
