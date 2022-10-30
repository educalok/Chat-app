import React from 'react'
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

import './styles/Home.module.css'

function Home () {
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
                <Input mt='2' placeholder='Username' size='md' />
                <FormLabel>Room</FormLabel>
                <Input mt='2' placeholder='Room' size='md' />
              </Grid>
            </VStack>
            <Center mt='2'>
              <Button
                bg='teal.600'
                color='white'
                fontWeight='bold'
                fontSize='xl'
                _hover={{ bg: 'teal.800' }}
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
