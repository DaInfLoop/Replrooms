const ws = require("ws");
const { v4: uuid } = require('uuid')
const { fetch } = require('undici')

function payload(event, data) {
  if ([
    'HELLO', // Sent on join, tells user to send their username.
    'MESSAGE', // Sent when a new message is sent to server.
    'MESSAGES', // Sent after identification to get previous messages.
    'JOIN', // Sent when a new client joins, not current client.
    'LEAVE', // Sent when a client leaves, not current client.
    'BAN', // Sent when current client is banned.
    'DELETEM', // Sent when a message is deleted.
  ].includes(event) == false) return console.error('Invalid event name:', event)
  return JSON.stringify({
    e: event,
    d: data
  })
}

let pfpCache = {}

let [User, Message] = [require('./mongoose/models/User'), require('./mongoose/models/Message')]

module.exports = (server) => {

  const wss = new ws.Server({ server: server, path: "/ws" });

  wss.on("connection", async (socket) => {

    socket.id = uuid() // Temporary until fetched mongodb
    
    socket._events = {}


    socket.on = (event, cb) => {
      if (!socket._events[event]) socket._events[event] = []
      socket._events[event].push(cb)
    }

    socket.emit = (event, ...args) => {
      socket._events[event].forEach(cb => {
        cb(...args)
      })
    }

    function broadcast(data) {
      wss.clients.forEach((client) => {
        if (client !== socket && client.readyState === ws.OPEN) {
          client.send(data);
        }
      });
    }

    function sendAll(data) {
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(data);
        }
      });
    }

    socket.on("message", (data) => { // wouldn't this be caps? no because that's like ws.onmessage oh, then how can i get the evnet i sent in client? the MESSAGE
      // Loves to hate me, so it's a Buffer.
      try {
        data = JSON.parse(data.toString())
        socket.emit(data.e, data.d)
      } catch (err) {
        socket.send(JSON.stringify({e:'ERROR', d:err.name + ': ' + err.message}))
      }
    });

    function rng(min, max) {
      if( min == null ) {
      return Math.random()
    } else if( max == null ) {
      max = min
      min = 0
    }
    
    return min + Math.floor( Math.random() * ( max - min ))
    }
            
    socket.on("MESSAGESRV", async ({ message }) => {
      let user = await User.findById(socket.id)
      let resp = await fetch("https://replit.com/graphql", {
		  method: "POST",
	  	headers: {
		  	"Content-Type": "application/json",
	  		"User-Agent": "Mozilla/5.0",
  			"X-Requested-With": "ReplitProfilePictures",
  			"Referer": "https://replit.com"
  		},
  		body: JSON.stringify({
	  		query: "query userByUsername($username: String!) { user: userByUsername(username: $username) { image } }",
		  	variables: { username: user.username }
	  	})
  	  }).then(res => res.json())

      let data = resp.data || {}
      if (!pfpCache[user.username]) pfpCache[user.username] = 'https://i2.wp.com/repl.it/public/images/evalbot/evalbot_' + rng(17, 43) + '.png?ssl=1' 
      user.pfp = data.user ? data.user.image : pfpCache[user.username]

      const m = new Message({
        content: message,
        author: user
      })

      m.save()
      
      sendAll(payload("MESSAGE", { messageId: m._id, username: user.username, id: socket.id, message, pfp: data.user ? data.user.image : pfpCache[user.username], title: user.title != 'undefined' ? user.title : undefined }))

    }) // ?

    socket.on('DELETEM', async ({ id }) => {
      const m = await Message.findById(id)

      if (m.author.id == socket.id) {
        await m.remove()
        sendAll(payload('DELETEM', { id }))
      }
      
    })

    socket.on("close", (data) => {
      broadcast(payload('LEAVE', { username: socket.mongo.username, id: socket.id }))
    });
    
    socket.send(payload('HELLO', { id: socket.id, message: 'IDENTIFY_REQUIRED' }));
    socket.on('IDENTIFY', async ({name}) => {
      if (!name) return;
      socket.mongo = await User.findOne({username: name})
      if (!socket.mongo) {
        socket.mongo = new User({ username: name, _id: socket.id, title: 'undefined' })

        socket.mongo.save()
      } else {
        socket.id = socket.mongo._id
      }
      broadcast(payload('JOIN', { username: name, id: socket.id }))
      socket.send(payload('MESSAGES', await Message.find({})))
    })
  });

};