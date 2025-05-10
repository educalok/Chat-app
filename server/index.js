const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 4000

const GLOBAL_ROOM = 'global-chat-room'

const io = socketIO(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())

let connectedUsers = []

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`)

  // Track user data for this connection
  let currentUser = null

  socket.on('newUser', userData => {
    console.log('New user:', userData)

    if (!userData.userName || !userData.socketID) {
      console.warn('Invalid user data received')
      return
    }

    // Store user data for this connection
    currentUser = {
      id: socket.id,
      userName: userData.userName,
      socketID: userData.socketID
    }

    socket.join(GLOBAL_ROOM)
    connectedUsers.push(currentUser)
    io.to(GLOBAL_ROOM).emit('newUserResponse', connectedUsers)
  })

  socket.on('message', data => {
    if (!data.text) {
      console.warn('Invalid message format')
      return
    }

    // Enhance message with user data
    io.to(GLOBAL_ROOM).emit('messageResponse', {
      ...data,
      userName: currentUser?.userName || 'Anonymous',
      timestamp: Date.now()
    })
  })

  socket.on('typing', data => {
    // Use the stored user data instead of trusting client input
    if (!currentUser) return

    console.log(`Typing event from ${currentUser.userName}`)

    socket.broadcast.to(GLOBAL_ROOM).emit('typingResponse', {
      userId: currentUser.id,
      userName: currentUser.userName, // Always use server-stored username
      isTyping: data.isTyping,
      timestamp: Date.now()
    })
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    connectedUsers = connectedUsers.filter(user => user.socketID !== socket.id)
    io.to(GLOBAL_ROOM).emit('newUserResponse', connectedUsers)

    // Notify others that user stopped typing
    if (currentUser) {
      socket.broadcast.to(GLOBAL_ROOM).emit('typingResponse', {
        userId: currentUser.id,
        userName: currentUser.userName,
        isTyping: false,
        timestamp: Date.now()
      })
    }
  })
})

app.get('/api', res => {
  res.json({
    status: 'OK',
    activeUsers: connectedUsers.length,
    uptime: process.uptime()
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
