const WebSocketServer = require('ws')

const wss = new WebSocketServer.Server({ port: 8080 })

var intervalVar = null

wss.on("connection", ws => {
    
    console.log("new client connected")
    
    const activeUsers = {
        type: 'hb',
        data: [
            {
                username: "Jakke",
                rssi: -120,
            },
            {
                username: "Sepi",
                rssi: -80,
            },
        ]
    }
    
    const activeUsers2 = {
        type: 'hb',
        // TODO CRIT change array of objects to array of strings if using activeUsers2
        data: [
            {
                username: "Sepi",
                rssi: -120,
            },
            {
                username: "Östermalm",
                rssi: -80,
            },
            {
                username: "Keinonen",
                rssi: -110,
            }
        ]
    }
    
    
    const messages = {
        type: 'message',
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
    
    
    // On connect, send previously sent messages that idling node has received
    ws.send(JSON.stringify(messages))
    
    // On connect, send out active users of the LRC network
    ws.send(JSON.stringify(activeUsers))
    
    // setInterval(() => {
    //     ws.send(JSON.stringify(activeUsers))
    // }, 4000)
    
    // setTimeout(() => {
    //     setInterval(() => {
    //         ws.send(JSON.stringify(activeUsers2))
    //     }, 4000)
    // }, 2000)
    
    
    ws.on("message", data => {

        data = JSON.parse(data)

        if (data.hasOwnProperty('type') && data.type === 'hb') {
            console.log('Received heartbeat:', data.data)
        }

    })
    
})
console.log("The WebSocket server is running on port 8080")