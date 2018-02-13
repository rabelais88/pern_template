const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const fs = require('fs')
const http = require('http').Server(app) // not necessary. this is for socket.io v2 compatibility

const io = require('socket.io')(http)
//pg-promise support
/*
const pgp = require('pg-promise')(  )
const pgconfig = {}
const db = pgp(pgconfig)

db.any
db.multi
db.one
db.none
...
*/

app.use('/dist',express.static(path.join(__dirname,'dist')))

http.listen(process.env.PORT || 3000, function(){
  console.log("server is up at " + this.address().port)
})

app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())

io.on('connection',(skt) => {
  console.log('a socket connected')
  skt.on('getmsg',(data) => {
    console.log("message from app(socket):" + data)
    skt.emit('answer','hello guys!, this is server')
  })
})

app.get('/',(req,res) => {
  fs.readFile('index.html','utf8', (err,htmldata) => {
    res.send(htmldata)
    //if it's ejs, res.render()
  })
})

app.get('/getmsg',(req,res) => {
  console.log("message from app(http req):" + req.query.msg)
  const obj = {servermsg:"hello guys!, this is server",data2:false}
  res.json(obj)
})

process.on('unhandledRejection', r => console.log(r)); //error catcher