const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
  });

  // await getTitle(browser);
  await gotoMenuPage(browser, {link: 'https://www.colabug.com/favorites/image-website/'})

  // await browser.close();
})();

async function getTitle(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto('https://www.colabug.com/', { timeout: 60 * 1000 });
  const ctx = await page.$('.content-layout');
  if (ctx) {
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
      for (const tab of tabsN) {
        const menus = []
        const menuN = await tab.$('.slider_menu');
        if (menuN) {
          const navNList = await menuN.$$('.nav-item');
          if (navNList) {
            for (const navN of navNList) {
              const menu = await navN.$eval('a', (node) => {
                return {
                  title: node.innerText?.trim(),
                  link: node.getAttribute('data-link')?.trim()
                }
              });
              console.log(menu);
              menus.push(menu)
            }
          }
        }
        subTList.push(menus)
        console.log('----------------');
      }
      subTList.forEach((it) => {
        console.log(it);
      });
    }
  }
}

async function gotoMenuPage(browser, menu) {
  if (menu.link) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })
    await page.goto(menu.link, {timeout: 60 * 1000})
    const ctx = await page.$('.content-layout')
    if (ctx) {
      const row = await ctx.$('.row')
      if (row) {
        const list = await row.$$('.url-card')
        list && await handlenNaviList(list)
      }
      const page = await ctx.$('.posts-nav')
    }
  }
}

async function handlenNaviList(list) {
  const navList = []
  for await (const nav of list) {
    const obj1 = await nav.$eval('a.card', el => {
      return {
        link: el.getAttribute('href'),
        intro: el.getAttribute('data-original-title')
      }
    })
    
    const obj2 = await nav.$eval('img.unfancybox', el => {
      return {
        img: el.getAttribute('src'),
        title: el.getAttribute('alt')
      }
    })

    const obj = {...obj1, ...obj2}
    console.log(obj);
    navList.push(obj)
  }
}
