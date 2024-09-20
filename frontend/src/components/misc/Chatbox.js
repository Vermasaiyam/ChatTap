import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import SingleChat from '../SingleChat';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();

  
  const bg = useColorModeValue('white', '#111B21')

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={bg}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;