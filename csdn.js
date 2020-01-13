///爬取CSDN博客网站///

const puppeteer = require('puppeteer');
const {csdn} = require('./sql/csdn');

(async ()=>{
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  // await getCate(page)
  // await getArticleList(page, [{ cate: '架构', link: 'https://www.csdn.net/nav/arch' },{ cate: '前端', link: 'https://www.csdn.net/nav/web' }])
  let data = await getArticle(page, 'https://blog.csdn.net/qq_40693171/article/details/103747729')
  // if()
  const result = await csdn(data)
  if(result.affectedRows>0) {
    // return {success: true, message: '博客发布成功！', data: null}
    console.log('博客发布成功！')
  } else {
    // return {success: false, message: '博客发布失败！', data: null}
    console.error('博客发布失败！')
  }
  await browser.close()
})()

/**
 * 获取类别
 * @param {*} page 页面对象实例
 */
async function getCate(page){
  try {
    await page.goto('https://www.csdn.net/', {timeout: 60*1000})
    let cateE =await page.$('.nav_com')
    let cates = await cateE.$$eval('a', nodes=>nodes.map(n=>{
      return {cate: n.innerText, link: 'https://www.csdn.net'+n.getAttribute('href')}
    }))
    console.log('cates: ', cates)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 获取类型文章列表
 * @param {*} page 页面对象实例
 * @param {Array} cate 类型列表
 */
async function getArticleList(page, cate){
  if(!cate || cate.length===0){return}
  try {
    for(let i=0; i<cate.length; i++) {
      await page.goto(cate[i]['link'], {timeout: 60*1000})
      let articsE0 = await page.$('#feedlist_id')
      let articsE = await articsE0.$$('.list_con')
      let prom = await articsE.map(async artic=>{
        let title = await artic.$eval('.title>h2>a', n=>n.innerText.trim())
        let link = await artic.$eval('.title>h2>a', n=>n.getAttribute('href'))
        return {title, link}
      })
      let artics = await Promise.all(prom)
      console.log('artics: ', artics)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 获取文章内容
 * @param {*} page 页面对象实例
 * @param {string} src 文章链接
 */
async function getArticle(page, src){
  let link = ''
  if(typeof src === 'object') { link = src.link } else { link = src }
  try {
    await page.goto(link, {timeout: 60*1000})
    await new Promise(resolve=>{setTimeout(resolve, 500)})
    let tags = []
    let tagsE = await page.$$('.artic-tag-box')
    for(let i=0; i<tagsE.length; i++){
      tags = tags.concat(await tagsE[i].$$eval('a',nodes=>nodes.map(n=>n.innerText.replace(/#/g, '').trim())))
    }
    let title = await page.$eval('.title-article', n=>n.innerText)
    let content = await page.$eval('#content_views', n=>n.innerHTML)
    content = content.replace(/'/g,'')
    content = await page.evaluate(content=>{ // 移除文章中代码前面的行数
      let div = document.createElement("div")
      div.innerHTML = content
      let nodes = div.getElementsByClassName("pre-numbering")
      const len = nodes.length
      for(let i=0;i<len;i++){div.getElementsByClassName("pre-numbering")[0].remove()}
      return div.innerHTML
    },content)
    return {title, category:tags, content}
  } catch (error) {
    console.error(error)
    return {title: '', category: [], content: ''}
  }
}