import { Avatar, Box, Text, Tooltip, useColorMode, useColorModeValue } from '@chakra-ui/react';
import ScrollableFeed from "react-scrollable-feed";
import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, isFirstMessage, isFirstMessageBySender, isReceivedMessage } from '../config/chatLogics';
import { ChatState } from '../Context/ChatProvider';
import moment from 'moment'


const ScrollableChat = ({ messages }) => {

  const { selectedChat, setSelectedChat, user } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();


  const bg = useColorModeValue('white', '#111B21')
  const bg1 = useColorModeValue('white', '#212121')
  const bg2 = useColorModeValue('white', '#2A2F32')
  const bg3 = useColorModeValue('#38B2AC', 'gray')
  const sender = useColorModeValue('#BEE3F8', '#2F5A70');
  const receiver = useColorModeValue("#B9F5D0", '#123429');
  const color = useColorModeValue('#123429', 'white')

  return (

    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          // Get the current message date
          const currentMessageDate = moment(m.createdAt).startOf('day');

          // Get the previous message date if it exists
          const previousMessageDate = i > 0 ? moment(messages[i - 1].createdAt).startOf('day') : null;

          // Check if the date has changed (for a new day)
          const isNewDay = !previousMessageDate || !currentMessageDate.isSame(previousMessageDate, 'day');

          // Format the date for the display
          let formattedDate = '';
          if (isNewDay) {
            if (currentMessageDate.isSame(moment(), 'day')) {
              formattedDate = 'Today';
            } else if (currentMessageDate.isSame(moment().subtract(1, 'days'), 'day')) {
              formattedDate = 'Yesterday';
            } else {
              formattedDate = currentMessageDate.format('dddd, MMM D'); // e.g., "Monday, Sept 25"
            }
          }

          return (
            <React.Fragment key={m._id}>
              {/* Display the date marker if it's a new day */}
              {isNewDay && (
                <Box textAlign="center" my={2}>
                  <Text fontSize="12px" color="gray">
                    {`${moment().format('dddd')}, ${moment().subtract(10, 'days').calendar()}`}
                  </Text>
                </Box>
              )}

              {/* Display the chat message */}
              <div style={{ display: "flex" }}>
                {(isSameSender(messages, m, i, user._id) ||
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
                    backgroundColor: `${m.sender._id === user._id ? sender : receiver}`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  <Box display={'flex'} flexDirection={'column'}>
                    <Box>
                      {selectedChat.isGroupChat &&
                        isReceivedMessage(m, user._id) &&
                        (isFirstMessageBySender(messages, m, i) ||
                          isFirstMessage(messages, i, user._id)) && (
                          <Tooltip label={`${m.sender.name}`} placement="top-start" cursor={'pointer'} hasArrow>
                            <Text fontSize='10px' color={color} _hover={{ textDecoration: 'underline' }}>
                              {m.sender.name}
                            </Text>
                          </Tooltip>
                        )}
                    </Box>
                    <Text>{m.content}</Text>
                    <Text
                      display={'block'}
                      textAlign={'right'}
                      marginRight={0}
                      fontSize="8px"
                      color="gray"
                    >
                      {moment(m.createdAt).format('LT')}
                    </Text>
                  </Box>
                </span>
              </div>
            </React.Fragment>
          );
        })}
    </ScrollableFeed>





    // <ScrollableFeed>
    //   {messages &&
    //     messages.map((m, i) => (
    //       <div style={{ display: "flex" }} key={m._id}>
    //         {(isSameSender(messages, m, i, user._id) ||
    //           // name of sender in group chat at first message
    //           isLastMessage(messages, i, user._id)) && (
    //             <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
    //               <Avatar
    //                 mt="7px"
    //                 mr={1}
    //                 size="sm"
    //                 cursor="pointer"
    //                 name={m.sender.name}
    //                 src={m.sender.pic}
    //               />
    //             </Tooltip>
    //           )}
    //         <span
    //           style={{
    //             backgroundColor: `${m.sender._id === user._id ? sender : reciever
    //               // m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
    //               }`,
    //             // color: color,
    //             marginLeft: isSameSenderMargin(messages, m, i, user._id),
    //             marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
    //             borderRadius: "20px",
    //             padding: "5px 15px",
    //             maxWidth: "75%",
    //           }}
    //         >
    //           <Box display={'flex'} flexDirection={'column'}>
    //             <Box>
    //               {selectedChat.isGroupChat &&
    //                 isReceivedMessage(m, user._id) &&
    //                 (isFirstMessageBySender(messages, m, i) || isFirstMessage(messages, i, user._id)) &&
    //                 (
    //                   <Tooltip label={`${m.sender.name}`} placement="top-start" cursor={'pointer'} hasArrow>
    //                     <Text fontSize='10px' color={color} _hover={{textDecoration: 'underline'}}>{m.sender.name}</Text>
    //                   </Tooltip>
    //                 )}
    //             </Box>
    //             <Text>{m.content}</Text>
    //             {(
    //               <Text
    //                 display={'block'}
    //                 textAlign={'right'}
    //                 marginRight={0}
    //                 fontSize="8px"
    //                 color="gray"
    //               >
    //                 {moment(m.createdAt).format('LT')}
    //               </Text>
    //             )}

    //           </Box>
    //         </span>
    //       </div>
    //     ))}
    // </ScrollableFeed>
  )
}

export default ScrollableChat
