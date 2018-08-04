module.exports = async (options, page) => {
    const btn = await page.waitForSelector('#root > div > div > div.main-layout > div > header > div.d-sm-h.d-lg-b > section > ul > li.member-nav-item.d-sm-ib.va-sm-m > div > div > button > div > span > font > font', {timeout: 2000, visible:true});
    
    await page.click('#root > div > div > div.main-layout > div > header > div.d-sm-h.d-lg-b > section > ul > li.member-nav-item.d-sm-ib.va-sm-m > div > div > button > div > span > font > font');

    await page.waitForSelector('#root > div > div > div.main-layout > nav > ul > li:nth-child(4) > button', {timeout: 2000, visible:true});
    await page.click('#root > div > div > div.main-layout > nav > ul > li:nth-child(4) > buttonx');
    //sleep(5);
    //await page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle2']});
}
