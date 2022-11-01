import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  VStack,
  Flex,
  Box,
  Button,
  Center,
  Input,
  FormLabel,
  Grid,
  Stack,
  Heading
} from '@chakra-ui/react'

import '../styles/Home.module.css'

const Home = ({ socket }) => {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [room, setRoom] = useState('')

  const enterChat = e => {
    e.preventDefault()
    if (room !== '' && userName !== '') {
      localStorage.setItem('userName', userName)
      socket.emit('newUser', { userName, socketID: socket.id })
      navigate('/chat')
    } else {
      alert('Please enter a username and a room name')
    }
  }
  return (
    <Box h='50vh'>
      <Flex align={'center'} justify={'center'} bg='blackAlpha.200' h='100vh'>
        <Center
          w='100%'
          maxW={550}
          bg='white'
          position='absolute'
          borderRadius={5}
          p='6'
          boxShadow='0 1px 2px'
        >
          <VStack spacing='4'>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Wellcome to the Chat!
              </Heading>
            </Stack>
            <VStack>
              <Grid templateColumns='1fr 3fr' alignItems='center' gap={1}>
                <FormLabel>Username</FormLabel>
                <Input
                  name='username'
                  mt='2'
                  placeholder='Username'
                  size='md'
                  onChange={e => setUserName(e.target.value)}
                />
                <FormLabel>Room</FormLabel>
                <Input
                  name='room'
                  mt='2'
                  placeholder='Room'
                  size='md'
                  onChange={e => setRoom(e.target.value)}
                />
              </Grid>
            </VStack>
            <Center mt='2'>
              <Button
                bg='teal.600'
                color='white'
                fontWeight='bold'
                fontSize='xl'
                _hover={{ bg: 'teal.800' }}
                onClick={enterChat}
              >
                Enter
              </Button>
            </Center>
          </VStack>
        </Center>
      </Flex>
    </Box>
  )
}

export default Home
