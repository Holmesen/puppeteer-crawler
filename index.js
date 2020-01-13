const puppeteer = require("puppeteer");

// (async ()=>{
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   await page.goto("http://www.yundangnet.com/H5Map?companyid=3107&referenceno=2028863241")
//   await page.screenshot({path: 'ais.png'})
//   await browser.close()
// })()

(async ()=>{
  const browser = await puppeteer.launch()
  // getIndexCate(browser)
  getDetail(browser)
  
  // await browser.close()
})()

/**
 * 爬取首页类别
 * @param {*} browser 浏览器实例
 */
async function getIndexCate(browser){
  const page = await browser.newPage()
  await page.goto("http://www.fly63.com/")
  const cate = await page.$$(".icli")
  console.log("cate:", cate.length)
  if(cate.length>0) {
    let data = []
    let titleE = null
    let title = ''
    let more = ''
    let article = []
    for(let i=0; i<cate.length; i++) {
      title = ''
      more = ''
      article = []
      titleE = await cate[i].$(".ictilte")
      if(await titleE.$("h1")) {
        title = await titleE.$eval('h1', node=>node.innerText)
      }
      if(await titleE.$("span")) {
        title = await titleE.$eval('span', node=>node.innerText)
      }
      if(await titleE.$("a")) {
        more = await titleE.$eval('a', node=>node.getAttribute('href'))
      }
      articleE = await cate[i].$(".ica")
      if(await articleE.$("a")) {
        article = await articleE.$$eval('a', nodes=>nodes.map(n=>{return {title:n.innerText, link:n.getAttribute('href')}}))
      }
      data.push({cate: title, link: more, article: JSON.stringify(article)})
    }
    console.log("data: ", data)
  }
  page.close()
}

async function getDetail(browser){
  const page = await browser.newPage()
  await page.goto("http://www.fly63.com/article/detial/7158")
  let title = ""
  let ms = []
  let content = ""
  if(await page.$(".dcontent")){
    const articleE = await page.$(".dcontent")
    // 获取标题
    // if(await articleE.$(".title")) 
    //   title = await articleE.$eval(".title", node=>node.innerText)
    // // 获取标签
    // if(await articleE.$(".ms")){
    //   const msE = await articleE.$(".ms")
    //   ms = await msE.$$eval("span", nodes=>nodes.map(n=>{
    //     let txt = n.innerText
    //     if(!!txt) {
    //       return {name: txt.split(":")[0].trim(), value: txt.split(":")[1].trim()}
    //     }
    //     return {}
    //   }))
    // }
    if(await articleE.$(".content")){
      // let content_temp = await articleE.$(".content").toString()
      // console.log("content_temp: ", JSON.stringify(content_temp))
      // content = content_temp.substring(0, content_temp.indexOf("<style>")) || ""
      // console.log("page.content: ", JSON.stringify(page.content()))
      page.content().then(res=> {
        let temp0 = res.substring(res.indexOf('<div class="content content_style" data-v-61d5a382="">'))
        let temp1 = temp0.substring(0,temp0.indexOf('<style>'))
        console.log("temp1: ", temp1)
      })
    }
    // console.log({title, ms:JSON.stringify(ms)})
  }
}