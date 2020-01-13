const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool({
  limit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  charset: 'utf8mb4'
})

const query = function(sql, values){
  // console.log('sql: ', sql)
  return new Promise((resolve, reject)=>{
    pool.getConnection((err, connection)=>{
      if(err){
        console.error(err)
        resolve(err)
      } else {
        connection.query(sql, values, (err, data)=>{
          if(err) {
            reject(err)
          } else {
            console.log('data: ', JSON.parse(JSON.stringify(data)))
            resolve(JSON.parse(JSON.stringify(data)))
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = query