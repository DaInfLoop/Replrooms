const app = require("express").Router()
const db = new (require("@replit/database"))();
// Put API methods here, but don't put "/api/" at the start!

app.use((req, res, next) => {
  if (req.query.apiKey) req.apiKey = req.query.apiKey
  next()
})

app.get('/profile/:id', (req, res) => {
  res.json({code:200,message:"Coming soon..."})
})

app.post('/bot/createBot/', async (req, res) => {
  async function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }
  // let botTokenFormat = "X-XXXXXX-XXXXXX-X".replaceAll('X', (await makeid(1)))
  let bt1 = "X".replaceAll('X', (await makeid(1)))
  let bt2 = "X".replaceAll('X', (await makeid(1)))
  let bt3 = "X".replaceAll('X', (await makeid(1)))
  let bt4 = "X".replaceAll('X', (await makeid(1)))
  let bt5 = "X".replaceAll('X', (await makeid(1)))
  let bt6 = "X".replaceAll('X', (await makeid(1)))
  let bt7 = "X".replaceAll('X', (await makeid(1)))
  let bt8 = "X".replaceAll('X', (await makeid(1)))
  let bt9 = "X".replaceAll('X', (await makeid(1)))
  let bt10 = "X".replaceAll('X', (await makeid(1)))
  let bt11 = "X".replaceAll('X', (await makeid(1)))
  let bt12 = "X".replaceAll('X', (await makeid(1)))
  let bt13 = "X".replaceAll('X', (await makeid(1)))
  let bt14 = "X".replaceAll('X', (await makeid(1)))
  let finalToken = `${bt1}-${bt2 + bt3 + bt4 + bt5 + bt6 + bt7}-${bt8 + bt9 + bt10 + bt11 + bt12 + bt13}-${bt14}`
  let name = req.body.name
  let owner = req.body.owner

  return res.json({
    code: 200,
    data: {
      owner: owner,
      token: finalToken
    }
  });
})

// app.get('/message/:message/', async (req, res) =>{
//   if ('apiKey' in req) {
//     const apiKeys = await db.get('apiKeys')
//     if (apiKeys.includes(req.apiKey)) {
//       console.log(`Received request from ${req.apiKey}`)
//       res.json({
//         code: 204,
//         message: null
//       })
//       // TODO: Actually, you know, like, send the message (in that case, use POST)
//     }
//     else {
//     res.json({
//       code: 401,
//       message: 'The API key sent for this request is invalid.'
//     })
//     }
//   }
//   else {
//     res.json({
//       code: 401,
//       message: 'A valid API key was not sent for this request.'
//     })
//   }
// })

// // get recent messages
// app.get('/messages', async (req, res) => {
//   if ('apiKey' in req) {
//     const apiKeys = await db.get('apiKeys')
//     if (req.apiKey in apiKeys) {
//       // return recent messages
//     } 
//     else {
//     res.json({
//       code: 401,
//       message: 'A valid API key was not sent for this request.'
//     })  
//     }
//   }
//   else {
//     res.json({
//       code: 401,
//       message: 'A valid API key was not sent for this request.'
//     }) 
//   }
// })

module.exports = {
  app,
  route: '/api'
}