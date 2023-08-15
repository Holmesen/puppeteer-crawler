const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
  });

  // await getTitle(browser);
  await gotoMenuPage(browser, { link: 'https://www.colabug.com/favorites/image-website/' });

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
        const menus = [];
        const menuN = await tab.$('.slider_menu');
        if (menuN) {
          const navNList = await menuN.$$('.nav-item');
          if (navNList) {
            for (const navN of navNList) {
              const menu = await navN.$eval('a', (node) => {
                return {
                  title: node.innerText?.trim(),
                  link: node.getAttribute('data-link')?.trim(),
                };
              });
              console.log(menu);
              menus.push(menu);
            }
          }
        }
        subTList.push(menus);
        console.log('----------------');
      }
      subTList.forEach((it) => {
        console.log(it);
      });
    }
  }
}

async function gotoMenuPage(browser, menu, pageNum = 1, autoNext = false) {
  if (menu.link) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(menu.link, { timeout: 60 * 1000 });
    const ctx = await page.$('.content-layout');
    if (ctx) {
      const row = await ctx.$('.row');
      if (row) {
        const list = await row.$$('.url-card');
        list && (await handlenNaviList(list, pageNum));
      }
      if (!autoNext) {
        console.log('第1页');
        const pageN = await ctx.$('.posts-nav');
        if (pageN) {
          const aNList = await pageN.$$eval('.page-numbers', (nodes) => nodes.map((n) => n.innerText));
          console.log(aNList);
          if (aNList && aNList.length > 0) {
            await handlePageList(aNList.at(-1), browser, menu);
          }
        }
      }
    }
  }
}

async function handlenNaviList(list, pageNum = 1) {
  const navList = [];
  for await (const nav of list) {
    const obj1 = await nav.$eval('a.card', (el) => {
      return {
        link: el.getAttribute('href'),
        intro: el.getAttribute('data-original-title'),
      };
    });

    const obj2 = await nav.$eval('img.unfancybox', (el) => {
      return {
        img: el.getAttribute('src'),
        title: el.getAttribute('alt'),
      };
    });

    const obj = { ...obj1, ...obj2 };
    console.log(obj);
    navList.push(obj);
  }
  await outputFile(navList, pageNum);
}

async function handlePageList(num, browser, menu) {
  for (let i = 2; i <= num; i++) {
    const url = `${menu.link}/page/${i}/`;
    menu.link = url;
    console.log('*******************');
    console.log(`第${i}页`);
    await gotoMenuPage(browser, menu, i, true);
  }
}

async function outputFile(result, pageNum) {
  const resultString = JSON.stringify(result, null, 2);
  // const output = `module.exports = ${resultString};`;
  fs.writeFile(`data-${pageNum}.json`, resultString, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Output file created successfully.');
    }
  });
}
