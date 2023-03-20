const WebSocketServer = require('ws')
 
const wss = new WebSocketServer.Server({ port: 8080 })

var intervalVar = null
 
wss.on("connection", ws => {

    console.log("new client connected")

    const activeUsers = {
      type: 'users',
      data: [
        {
            username: "Jakke",
            rssi: "-97",
            online: true,
            lastSeen: 0,
        },
        {
            username: "Sepi",
            rssi: "-120",
            online: true,
            lastSeen: 0,
        },
        {
            username: "Östermalm",
            rssi: "-80",
            online: true,
            lastSeen: 0,
        },
        {
            username: "Keinonen",
            rssi: "-110",
            online: true,
            lastSeen: 0,
        }
      ]
    }


    const messages = {
      type: 'messages',
      data: [
        {
          id: 1,
          from: 'Jakke',
          to: 'Me',
          content: 'Hello!',
        },
        {
          id: 2,
          from: 'Me',
          to: 'Jakke',    
          content: 'Hello Jakke!',
        },
        {
          id: 3,
          from: 'Jakke',
          to: 'Me',
          content: 'Nice to meet here using LoRaChat!',
        },
        {
          id: 4,
          from: 'Sepi',
          to: 'Me',
          content: 'Sepi\'s message here also!',
        },
        {
          id: 5,
          from: 'Me',
          to: 'Sepi',
          content: 'Hi!',
        }
      ]
    }


    // intervalVar = setInterval(() => {
    //   ws.send(JSON.stringify(messages))
    // }, 1000)
 
    // On connect, send previously sent messages that idling node has received
    ws.send(JSON.stringify(messages))

    // On connect, send out active users of the LRC network
    ws.send(JSON.stringify(activeUsers))


    ws.on("message", data => {
      console.log(data.toString())
      data = JSON.parse(data)
        if (data.hasOwnProperty('type') && data.type === 'heartbeat') {
          console.log("Online: ", data.username)
        }
    })
 
})
console.log("The WebSocket server is running on port 8080")