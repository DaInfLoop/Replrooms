const express = require('express');
const http = require('http');
const fs = require('fs')
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const db = new (require('@replit/database'))();

const app = express();
const server = http.createServer(app);

require('./server')(server)

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
db.get("key").then(value => { });
app.use(bodyParser.json())
require('ejs')
app.use(cookieParser())
app.set('view engine', 'ejs')

const ActiveClients = []

// db setup
db.set('admins', [
  "issiah08",
  "VapWasTaken",
  "DaInfLoop",
  "replmod"
])

db.set('bans', [])



const routers = fs.readdirSync('./routers').filter((f) => f.endsWith('.js'))

routers.forEach((router) => {
  if (router == "! TEMPLATE.js") return
  const template = require('./routers/' + router)

  app.use(template.route, template.app)
  console.log(`Loaded router: ${router.slice(0, -3)}`)
})

app.use('/cdn', express.static('cdn'))






// Middlewares (GET)

app.get('/', function async(req, res) {
  res.render('home.ejs', {
    id: req.get('X-Replit-User-Id'),
    name: req.get('X-Replit-User-Name'),
    roles: req.get('X-Replit-User-Roles'),
    onlineUsers: ActiveClients
  })
})

// app.get('/profile/:username', function (req, res) {
//   res.render('profile.ejs', {
//     name: req.get('X-Replit-User-Name'),
//     isAdmin: req.get('X-Replit-User-Name') in db.get('admin')
//   })
// })

server.listen(3000) // websocket is running 420