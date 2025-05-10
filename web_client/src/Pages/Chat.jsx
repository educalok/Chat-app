import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom' // Add this import
import ChatBar from '../Components/ChatBar'
import ChatBody from '../Components/ChatBody'
import ChatFooter from '../Components/ChatFooter'

const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState('')
  const [roomUsers, setRoomUsers] = useState([]) // Track users in current room
  const lastMessageRef = useRef(null)
  const { room } = useParams() // Get room from URL

  useEffect(() => {
    // Initialize room join
    const userName = localStorage.getItem('userName')
    if (userName && room) {
      socket.emit('joinRoom', { userName, room })
    }

    // Room-specific message handler
    socket.on('messageResponse', data => {
      if (data.room === room) {
        // Only add if message belongs to this room
        setMessages(prev => [...prev, data])
      }
    })

    // Room users update handler
    socket.on('roomUsers', users => {
      setRoomUsers(users)
    })

    // Typing indicator handler (room-specific)
    socket.on('typingResponse', data => {
      if (data.room === room) {
        setTypingStatus(`${data.userName} is typing...`)
        setTimeout(() => setTypingStatus(''), 3000)
      }
    })

    // Cleanup listeners
    return () => {
      socket.off('messageResponse')
      socket.off('roomUsers')
      socket.off('typingResponse')
    }
  }, [socket, room])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='chat'>
      <ChatBar
        socket={socket}
        room={room}
        roomUsers={roomUsers} // Pass room users to sidebar
      />
      <div className='chat__main'>
        <ChatBody
          messages={messages.filter(m => m.room === room)} // Filter by current room
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          room={room} // Pass room info
        />
        <ChatFooter
          socket={socket}
          room={room} // Pass room to footer
        />
      </div>
    </div>
  )
}

export default Chat
