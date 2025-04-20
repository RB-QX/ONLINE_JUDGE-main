// backend/scripts/scrapeCFWithPuppeteer.js
const puppeteer = require('puppeteer-extra');
const Stealth = require('puppeteer-extra-plugin-stealth');
const CapSolver = require('capsolver');
const solver = new CapSolver({ apiKey: process.env.CAPSOLVER_KEY });
puppeteer.use(Stealth());


await solver.createTask({
    type: 'CF',
    url: page.url()
  });
  const solution = await solver.getTaskResult(taskId);
  await page.setCookie(...solution.cookies);


(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--proxy-server=http://USERNAME:PASSWORD@proxy.provider.com:8000'
        ]
    });
    const page = await browser.newPage();
    await page.goto('https://codeforces.com/problemset/problem/6804/D', {
        waitUntil: 'networkidle0',
    });
    const html = await page.content();
    console.log('✔️ Page loaded, HTML length:', html.length);
    await browser.close();
})();
