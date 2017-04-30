console.log('May Node be with you')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
var db

MongoClient.connect('mongodb://primongo:SWATIR31@ds123381.mlab.com:23381/pri-mongodbquotes',(err, database)=>{
if(err) return console.log(err)
db = database;
app.listen(3001, ()=> {
  console.log('listening on 3001')
})
})

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req,res)=>{
 db.collection('quotes').find().toArray((err,result)=>{
    if (err) return console.log(err)
    //renders index.ejs

    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req,res)=>{
 db.collection('quotes').save(req.body, (err, result)=>{
   if(err) return console.log(err)
    console.log('saved to db')
    res.redirect('/')
 })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate({name: 'yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
