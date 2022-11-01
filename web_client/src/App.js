import { BrowserRouter, Routes, Route } from 'react-router-dom'
import socketIO from 'socket.io-client'
import { ChakraProvider } from '@chakra-ui/react'

import './styles/globals.css';
import Chat from './Pages/Chat'
import Home from './Pages/Home'

const socket = socketIO.connect('http://localhost:4000')
function App () {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path='/' element={<Home socket={socket} />}></Route>
            <Route path='/chat' element={<Chat socket={socket} />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
