import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/misc/SideDrawer';
import MyChats from '../components/misc/MyChats';
import Chatbox from '../components/misc/Chatbox';
import { Box } from '@chakra-ui/react';

const ChatPage = () => {
    const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats/>}
        {user && (
          <Chatbox />
        )}
      </Box>
    </div>
  );
}

export default ChatPage
