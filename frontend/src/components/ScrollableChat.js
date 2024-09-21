import { Avatar, Tooltip, useColorMode, useColorModeValue } from '@chakra-ui/react';
import ScrollableFeed from "react-scrollable-feed";
import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/chatLogics';
import { ChatState } from '../Context/ChatProvider';


const ScrollableChat = ({messages}) => {

    const { user } = ChatState();
    const { colorMode, toggleColorMode } = useColorMode();

    
    const bg = useColorModeValue('white', '#111B21')
    const bg1 = useColorModeValue('white', '#212121')
    const bg2 = useColorModeValue('white', '#2A2F32')
    const bg3 = useColorModeValue('#38B2AC', 'gray')
    const sender = useColorModeValue('#BEE3F8','#2F5A70');
    const reciever = useColorModeValue("#B9F5D0",'#123429');
    const color = useColorModeValue('black', 'white')

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              // name of sender in group chat at first message
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? sender : reciever
                  // m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                // color: color,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
