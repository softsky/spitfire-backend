module.exports = async (options, page) => {
    const btn = await page.waitForSelector('#root > div > div > div.main-layout > div > header > div.d-lg-h.d-sm-b > section > div.prl4-sm.prl7-lg.va-sm-m.ta-sm-r > button', {timeout: 20000, visible:true});
    
    await page.click('#root > div > div > div.main-layout > div > header > div.d-lg-h.d-sm-b > section > div.prl4-sm.prl7-lg.va-sm-m.ta-sm-r > button');

    await page.waitForSelector('#root > div > div > div.main-layout > nav > ul > li:nth-child(4) > button', {timeout: 20000, visible:true});
    await page.click('#root > div > div > div.main-layout > nav > ul > li:nth-child(4) > button');
    //sleep(5);
    //await page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle2']});
}
