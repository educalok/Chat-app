const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const PORT = process.env.PORT || 4000
const socketIO = require('socket.io')(http, {
  cors: {
    origin: [`http://localhost:3000`, `https://chat-app-educalok.vercel.app`]
  }
})

app.use(cors())
let users = []

socketIO.on('connection', socket => {
  socket.on('message', data => {
    socketIO.emit('messageResponse', data)
  })

  socket.on('typing', data => socket.broadcast.emit('typingResponse', data))

  socket.on('newUser', data => {
    users.push(data)
    socketIO.emit('newUserResponse', users)
  })

  socket.on('disconnect', () => {
    users = users.filter(user => user.socketID !== socket.id)
    socketIO.emit('newUserResponse', users)
    socket.disconnect()
  })
})

app.get('/api', (req, res) => {
  res.json({ message: 'Hello' })
})

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
