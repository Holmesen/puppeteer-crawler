const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\26018\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
  });

  await getTitle(browser);

  // await browser.close();
})();

async function getTitle(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto('https://www.colabug.com/', { timeout: 60 * 1000 });
  const ctx = await page.$('.content-layout');
  if (ctx) {
    // const innerTextArray = await page.evaluate(() => {
    //   const els = Array.from(page.querySelectorAll('.text-gray'));
    //   return els.map((element) => {
    //     console.log('title: ', element.innerText);
    //     return element.innerText;
    //   });
    // });
    const titleList = await ctx.$$eval('.text-gray', (nodes) =>
      nodes.map((n) => {
        return n.innerText;
      })
    );
    titleList.forEach((t) => {
      console.log(t);
    });

    console.log('==============');

    const tabsN = await ctx.$$('.flex-tab');
    if (tabsN) {
      let subTList = [];
      subTList = await tabsN.map(async (tab) => {
        let menu = '';
        const menuN = await tab.$('.slider_menu');
        if (menuN) {
          const navN = await menuN.$('.nav-item');
          if (navN) {
            menu = await navN.$eval('a', (node) => {
              console.log(node.innerText);
              return node.innerText;
              // console.log(`${node.innerText} - ${node.getAttribute('data-link')}`);
              // return `${node.innerText} - ${node.getAttribute('data-link')}`;
            });
            return menu;
            // subTList.push(menu);
          }
        }
      });
      subTList.forEach((it) => {
        console.log(it);
      });
      // menuN.$$eval('.nav-item', (nodes) =>
      //   nodes.map((n) => {
      //     return n.innerText;
      //   })
      // )
    }
    // const subTList = await ctx.$$eval('.flex-tab', (nodes) =>
    //   nodes.map((n) => {
    //     n.$('.slider_menu')
    //   })
    // )
  }
}
