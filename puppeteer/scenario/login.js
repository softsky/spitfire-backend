module.exports = async (options, page) => {
        await page.click('button[data-qa="mobile-nav-menu-button"]');
        await page.waitForSelector('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');
        await page.click('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button');

        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', options.account.username);
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', options.account.password);
        await page.click('input[type="button"][value="ログイン"]');
        // await page.waitForNavigation({waitUntil: 'networkidle0'});
    }
