const app = require("express").Router()

app.get('/', (req, res) => {
  // This will be "/cool-router".
  res.send('very cool!')
})

app.get('/so-cool/*', (req, res) => { 
  // Matches the following: /cool-router/so-cool/yes, /cool-router/so-cool/very134 and so on.
  const args = req.url.split('/')
  args.shift(); // Removes /cool-router
  args.shift(); // Removes /so-cool
  res.send()
})


module.exports = {
  app,
  route: '/cool-router'
}