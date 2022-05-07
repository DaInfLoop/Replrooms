(async () => {

  let admins = ['VapWasTaken', 'DaInfLoop', 'isaiah08', 'replmod']
  
    window.scrollTo(0, document.body.scrollHeight);
  const ws = new WebSocket("wss://replrooms.justsomedevelopers.repl.co/ws")

  ws.addEventListener('open', function() {
    // document.getElementById("loading").remove()
    ws.send(JSON.stringify({e:'IDENTIFY', d:{name:`${ClientUsername}`}}))
  })

  ws.addEventListener('close', function() {
    SystemMessage("Uh oh, looks like you're not connected! This can be because of two things:<br>- You aren't connected to the internet.<br>- The replrooms server is down. If this is the case please wait.")
    document.body.style.cursor = "not-allowed"
  })

  /*self.addEventListener('fetch', function(e) {
    if(!self.navigator.onLine) {
          SystemMessage("Uh oh, looks like you're not connected! This can be because of two things:<br>- You aren't connected to the internet.<br>- The replrooms server is down. If this is the case please wait.")
    }
  })*/

  function SystemMessage(message) {
    let obj = {
      username: 'SYSTEM [OFFICIAL]',
      pfp: 'https://i2.wp.com/repl.it/public/images/evalbot/evalbot_26.png?ssl=1',
      message: message
    }
    const messages = document.getElementById("messages");
    const li = document.createElement('li')
    const a = document.createElement('a')
    const p = document.createElement('p')
    const pfp = document.createElement('img')

    a.innerHTML = obj.username;
    p.innerHTML = obj.message;

    pfp.src = obj.pfp
    pfp.className = "pfp"

    li.appendChild(a)
    li.appendChild(p)
    li.appendChild(pfp)
    messages.appendChild(li)
    window.scrollTo(0, document.body.scrollHeight);
  }

  function checkswear(msg) {
    let swearlist = window.getSwears()
    if (swearlist.includes(msg)) return true;
    return false;
  }

  let events = {
    _events: {},
    on: (event, callback) => {
      if (!events._events[event]) events._events[event] = []
      events._events[event].push(callback)
    },
    emit: (event, ...args) => {
      events._events[event].forEach(cb => {
        cb(...args)
      })
    }
  }

  let userId;

  ws.onmessage = ({ data }) => {
    data = JSON.parse(data)

    events.emit(data.e, data.d)
  }

  events.on('HELLO', ({id}) => {
  })

  let cooldown = false;

  document.getElementById('messageformsend').addEventListener('click', () => {
    if (document.getElementById("messageformtext").value == "") {
      document.getElementById("messageformtext").style.border = "1px solid #ff4938"
      setTimeout(function() {
        document.getElementById("messageformtext").style.border = "1px solid #000000"
      }, 2000)
      return;
    }
    if (cooldown == false) {
      let message = document.getElementById("messageformtext").value;

      if (message == "/ping") return SystemMessage('Pong!');
      if (message == "/admin") {
        let msg = `
        <a class="btn btn-primary" id="ban_button_admin">Ban</a>
        <a class="btn btn-primary" id="kick_button_admin">Kick</a>
        <a class="btn btn-primary" id="mute_button_admin">Mute</a>
        <a class="btn btn-primary" id="warn_button_admin">Warn</a>
        `
        if(!['VapWasTaken', 'DaInfLoop', 'isaiah08', 'replmod'].includes(ClientUsername)) msg = "You are not an admin, you can't run this!";
        SystemMessage(msg)
        return document.getElementById("messageformtext").value = "";
        
      }
      if (checkswear(document.getElementById("messageformtext").value) == true) {
        return SystemMessage('Hey! Your message included a bad word. We try to keep this community safe and friendly for everybody, so please do not swear.')
      }
      ws.send(JSON.stringify({
        e: 'MESSAGESRV',
        d: {
          username: ClientUsername, // defined automaticly (keep this comment)
          message: document.getElementById("messageformtext").value
        }
      }))
      document.getElementById("messageformtext").value = ""
      cooldown = true
      setTimeout(function() {
        cooldown = false
      }, 500)
    } else {
      // SYSTEM MESSAGE
      SystemMessage('Heya, calm down there! You\'re typing too fast.')
    }
  })

  document.getElementById("messageformtext").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      document.getElementById('messageformsend').click();
    }
  })

  events.on('DELETEM', ({ id }) => {
    document.getElementById(id).remove()
  })

  events.on('MESSAGES', (m) => {
    m.forEach((ms) => {
      events.emit('MESSAGE', {
        messageId: ms._id,
        message: ms.content,
        title: ms.author.title == 'undefined' ? undefined : ms.author.title,
        username: ms.author.username,
        pfp: ms.author.pfp
      }, false)
    })
  })

  window.deleteMessage = function deleteMessage(id) {
    let el = document.getElementById(id)

    if (!el) return;
    return ws.send(JSON.stringify({ e: 'DELETEM', d: { id }}))
  }

  events.on('MESSAGE', async (obj, mention = true) => {
    // console.log(message)
    // console.log(JSON.stringify(username), JSON.stringify(message))
    const messages = document.getElementById("messages");
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.setAttribute('target', '_blank')
    const p = document.createElement('p')
    const pfp = document.createElement('img')

    a.textContent = `${obj.title ? '[object ' + obj.title + '] ' : ''}${obj.username}`;
    a.setAttribute('userName', obj.username)
    a.href = "https://replit.com/@" + obj.username
    p.textContent = obj.message;

    pfp.src = obj.pfp
    pfp.className = "pfp"

    li.appendChild(a)
    li.appendChild(p)
    li.appendChild(pfp)
    li.id = obj.messageId
    messages.appendChild(li)
    window.scrollTo(0, document.body.scrollHeight);
    if (p.textContent.includes(`@${ClientUsername}`) && mention) {
      var mention = new Audio(
        '../cdn/audio/mention.mp3'
      )
      mention.play();
    }
  })
})();