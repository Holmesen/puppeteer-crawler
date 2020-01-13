const query = require('../lib/mysql');
const randomString = require('../utils').randomString;
const getTheDate = require('../utils').getTheDate;

function csdn(data){
  return query(`INSERT INTO blog(keyid, category, title, ukeyid, date, place, weather, content, views, zan, cai, collect, share, updateTime)
  VALUES('${randomString(16)}' ,'${data.category||[]}' ,'${data.title||''}' ,'AcJrAcAGXbQtQPNr' ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} ,
  '${data.place||''}' ,'${data.weather||''}' ,'${data.content||''}' ,${data.views||0} ,${data.zan||0} ,${data.cai||0} , ${data.collect||0}, ${data.share||0}, ${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

module.exports = {
  csdn
}