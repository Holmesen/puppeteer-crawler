function subArr2Str(str) {
  if(str+'' !== 'undefined' && str+'' !== 'null' && typeof str !== String) {
    str += ''
  }
  if(!str || (str.indexOf('[')===-1) || (str.indexOf(']')===-1)) {
    return ''
  }
  return str.substring(str.indexOf('[')+1, str.indexOf(']'))
}

function randomString(len=16) {
  len = len > 16 ? 16 : len
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length
  var str = ''
  for (i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

function getTheDate(gap='-') {
  const date = new Date()
  const y = date.getFullYear()
  const M = date.getMonth() +1
  const d = date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()

  return y+gap+((M+'').length===1?('0'+M+''):M)+gap+((d+'').length===1?('0'+d+''):d)+' '
    +((h+'').length===1?('0'+h+''):h)+':'+((m+'').length===1?('0'+m+''):m)+':'+((s+'').length===1?('0'+s+''):s)
}

module.exports = {
  subArr2Str,
  randomString,
  getTheDate
}