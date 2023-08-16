const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // const browser = await puppeteer.launch({
  //   executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  //   headless: false,
  // });
  // await getTitle(browser);
  // await gotoMenuPage(browser, { link: 'https://www.colabug.com/favorites/image-website/' });
  // const page = await browser.newPage();
  // await handleDetail(page, 'https://www.colabug.com/sites/14385/')
  // await handlePageList(browser);
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

// 处理分类页的导航信息2
async function handleNaviList(list) {
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
  console.log('结束↑↑↑↑↑↑↑↑↑↑');
  // await outputFile(navList, pageNum);
}

// 分类页
async function handlePageList(browser) {
  const baseUrl = 'https://www.colabug.com/sitetag/ai-writing-tools/';
  const pageCount = 2;
  for (let i = 1; i <= pageCount; i++) {
    let url = baseUrl;
    if (i > 1) {
      url = `${baseUrl}page/${i}/`;
    }
    console.log('*******************');
    await wait(10);
    console.log(`第${i}页开始↓↓↓↓↓↓↓↓↓↓↓`);
    await handleCateList(url, browser);
  }
}
// 处理分类页的所有导航信息
async function handleCateList(url, broswer) {
  console.log('url: ', url);
  if (url) {
    const page = await broswer.newPage();
    await page.goto(url, { timeout: 60 * 1000 });
    const ctx = await page.$('.content-layout');
    if (ctx) {
      const row = await ctx.$('.row');
      if (row) {
        const list = await row.$$('.url-card');
        list && (await handleNaviList(list));
      }
    }
  }
}

// 输出到文件
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

// 导航详情
async function handleDetail(page, link) {
  await page.goto(link, { timeout: 60 * 1000 });
  const ctx = await page.$('#content');
  if (ctx) {
    const siteBody = await ctx.$('.site-body');
    if (siteBody) {
      const siteName = await siteBody.$eval('.site-name', (node) => node.innerText);
      console.log(siteName);
      const tags = await siteBody.$$eval('.mr-2', (nodes) => nodes.map((n) => n.innerText));
      console.log(tags);
    }

    const ctxL = await ctx.$('.content-layout');
    if (ctxL) {
      const siteCtx = await ctxL.$('.site-content');
      if (siteCtx) {
        const intro = await siteCtx.$eval('.panel-body', (node) => node.innerText);
        console.log(intro);
      }
    }
  }
}

// 等待函数
async function wait(s = 0) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, s * 1000);
  });
}
