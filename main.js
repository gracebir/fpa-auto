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
    try {
        console.log("Attempting to type the ID...");
        await page.waitForSelector("#membId", { visible: true });
        await page.type("#membId", "hhs0609", { delay: 100 });
        console.log("ID typed successfully.");

        console.log("Attempting to type the password...");
        await page.waitForSelector("#pwd", { visible: true });
        await page.type("#pwd", "ch2730053**", { delay: 100 });
        console.log("Password typed successfully.");

        console.log("Attempting to click the login button...");
        await page.waitForSelector(".btnLogin", { visible: true });

        // Use evaluate to click the button
        await page.evaluate(() => {
            document.querySelector(".btnLogin").click();
        });

        console.log("Login button clicked successfully.");

        // Wait for login to complete and navigate back to the home page
        await page.waitForNavigation();
        console.log("Login successful and navigation completed.");
    } catch (error) {
        console.error("Login failed: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Scroll and click on "Insurance of Building Register"
    console.log("Navigating to 'Insurance of Building Register'...");
    await page.waitForSelector(".bldre1");
    await page.evaluate(() => {
        document.querySelector(".bldre1").scrollIntoView();
    });
    await page.click(".bldre1");
    console.log("'Insurance of Building Register' clicked.");

    // Click on the "Search by Address" button
    try {
        console.log("Attempting to click 'Search by Address' button...");
        await page.waitForSelector('.btnLotNum', { visible: true });
        await page.click('.btnLotNum');
        console.log("'Search by Address' button clicked successfully.");
    } catch (error) {
        console.error("Failed to click 'Search by Address' button: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Select address from dropdowns
    try {
        console.log("Selecting address from dropdowns...");
        await page.waitForSelector('select[name="sidoCd"]', { visible: true });
        await page.select('select[name="sidoCd"]', '경기도');
        console.log("Selected '경기도'.");

        await page.waitForSelector('select[name="sigunguCd"]', { visible: true });
        await page.select('select[name="sigunguCd"]', '고양시일산동구');
        console.log("Selected '고양시일산동구'.");

        await page.waitForSelector('select[name="bjdongCd"]', { visible: true });
        await page.select('select[name="bjdongCd"]', '마두동');
        console.log("Selected '마두동'.");

        await page.waitForSelector('select[name="platGbCd"]', { visible: true });
        await page.select('select[name="platGbCd"]', '대지');
        console.log("Selected '대지'."); // Adjust this value as needed

        // Enter the detailed address number
        await page.type('input[name="mnnm"]', '796');
        console.log("Entered detailed address number '796'.");

        // Click the view button
        await page.click('.btnNext');
        console.log("Clicked 'View' button.");
    } catch (error) {
        console.error("Failed to select address or click 'View' button: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Wait for the results to be visible
    try {
        console.log("Waiting for the results to be visible...");
        await page.waitForSelector(".result-item", { visible: true }); // Adjust the selector as needed
        console.log("Results are visible.");
    } catch (error) {
        console.error("Failed to find results: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Click on the result item to view details
    try {
        console.log("Clicking on the result item...");
        await page.click(".result-item"); // Adjust the selector as needed
        console.log("Result item clicked.");
    } catch (error) {
        console.error("Failed to click on the result item: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Wait for the PDF download button to be visible and click it
    try {
        console.log("Waiting for the PDF download button to be visible...");
        await page.waitForSelector('button[title="Download PDF"]', { visible: true }); // Adjust the selector as needed
        await page.click('button[title="Download PDF"]');
        console.log("PDF download button clicked.");
    } catch (error) {
        console.error("Failed to click the PDF download button: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Wait for the download to start and complete
    try {
        console.log("Waiting for the download to complete...");
        await page.waitForSelector(".download-complete", { timeout: 30000 }); // Adjust the selector as needed
        console.log("Download complete.");
    } catch (error) {
        console.error("Download failed: ", error.message);
        await browser.close();
        process.exit(1);
    }

    // Close the browser
    await browser.close();
    console.log("Browser closed.");
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
