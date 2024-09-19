import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/misc/SideDrawer';
import MyChats from '../components/misc/MyChats';
import Chatbox from '../components/misc/Chatbox';
import { Box, Flex } from '@chakra-ui/react';

const ChatPage = () => {
  const { user } = ChatState() || {};

  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div style={{ width: "100%", maxHeight: "100vh", overflow: "hidden" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        <Flex minH={"100%"} gap={5}>
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}

        </Flex>
      </Box>
    </div>
  );
}

export default ChatPage
