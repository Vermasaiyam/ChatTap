import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Box, Button, Flex, Spacer, Stack, Text, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react';

import { getSender } from '../../config/chatLogics'

import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();


    const fetchChats = async () => {
        console.log(user);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    const bg = useColorModeValue('white', '#111B21')
    const bg1 = useColorModeValue('#F8F8F8', '#212121')
    const bg2 = useColorModeValue('#E8E8E8', '#2A2F32')
    const bg3 = useColorModeValue('#38B2AC', 'gray')
    const color = useColorModeValue('black', 'white')

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg={bg}
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
            minH={"100%"}
        >

            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                <Text fontSize={{ base: "38px", md: "25px", lg: "38px" }}>My Chats</Text>
                <Spacer />
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                // bg="#F8F8F8"
                bg={bg1}
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
                maxH={"90%"}
            >
                {chats ? (
                    <Stack overflowY="scroll" minH={"90%"}>
                        {/* Sort chats based on the latest message timestamp */}
                        {chats
                            .slice()
                            // .sort((a, b) => {
                            //     // Safeguard: Ensure latestMessage and createdAt exist
                            //     const dateA = a.latestMessage && a.latestMessage.createdAt 
                            //         ? new Date(a.latestMessage.createdAt) 
                            //         : new Date(0);  // Fallback to an old date if missing
                
                            //     const dateB = b.latestMessage && b.latestMessage.createdAt 
                            //         ? new Date(b.latestMessage.createdAt) 
                            //         : new Date(0);  // Fallback to an old date if missing
                
                            //     // Debug: Log the chats and their dates
                            //     console.log("Chat A createdAt:", a.latestMessage ? a.latestMessage.createdAt : "No latestMessage", " => ", dateA);
                            //     console.log("Chat B createdAt:", b.latestMessage ? b.latestMessage.createdAt : "No latestMessage", " => ", dateB);
                
                            //     // Sort in descending order (most recent message first)
                            //     return dateB - dateA;
                            // })
                            .reverse()
                            .map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    display={'flex'}
                                    // bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    // color={selectedChat === chat ? "white" : "black"}
                                    bg={selectedChat === chat ? bg3 : bg2}
                                    color={selectedChat === chat ? "white" : color}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Box>
                                        <Avatar
                                            size="md"
                                            cursor="pointer"
                                            mx={'2'}
                                            name={user.name}
                                            src={chat.isGroupChat ? 'group_logo1.jpg' : user.pic}
                                        />
                                    </Box>
                                    <Box>

                                        <Text>
                                            {!chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)
                                                : chat.chatName}
                                        </Text>
                                        {chat.latestMessage && (
                                            <Text fontSize="xs">
                                                <b>{chat.isGroupChat && `${chat.latestMessage.sender.name}:`} </b>
                                                {chat.latestMessage.content.length > 50
                                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                                    : chat.latestMessage.content}
                                            </Text>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
