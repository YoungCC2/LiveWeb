const puppeteer = require("puppeteer");
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 访问页面
    await page.goto('http://tie.163.com/#/splendid');
    await page.setViewport({
        width: 1920,
        height: 900
    })
    // 进行截图
    await page.screenshot({
        path: 'log_img/example.png'
    });

    await browser.close();
})();