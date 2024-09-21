import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Flex, FormControl, IconButton, Input, Spinner, Text, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from './misc/ProfileModal';
import { getSender, getSenderFull } from '../config/chatLogics';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'
import { IoSend } from "react-icons/io5";

import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();



    const { colorMode, toggleColorMode } = useColorMode();


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );

            console.log(messages);

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                // console.log(data);

                socket.emit("new message", data);
                setMessages([...messages, data]);
                
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const sendMessageUsingIcon = async () => {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setNewMessage("");
            const { data } = await axios.post(
                "/api/message",
                {
                    content: newMessage,
                    chatId: selectedChat,
                },
                config
            );
            // console.log(data);

            socket.emit("new message", data);
            setMessages([...messages, data]);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => {
            setSocketConnected(true);
        })
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [])


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    console.log(notification, '-----');


    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                // if (!notification.includes(newMessageRecieved)) {
                //     setNotification([newMessageRecieved, ...notification]);
                //     setFetchAgain(!fetchAgain);
                // }
                // Check if the message from the same user already exists
                const isDuplicate = notification.some(
                    (msg) =>
                        msg._id === newMessageRecieved._id || // Check for duplicate message by ID
                        (msg.sender._id === newMessageRecieved.sender._id && msg.chat._id === newMessageRecieved.chat._id)
                );

                if (!isDuplicate) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };


    const bg = useColorModeValue('white', '#111B21')
    const bg1 = useColorModeValue('#E8E8E8', '#212121')
    const bg2 = useColorModeValue('#E0E0E0', '#2A2F32')
    const bg3 = useColorModeValue('#38B2AC', 'gray')
    const color = useColorModeValue('black', 'white')



    return (
        <>
            {selectedChat ? (
                <>

                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)}
                        />

                        {(!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        ))}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        // bg="#E8E8E8"
                        bg={bg1}
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            idisplay="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 10 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Box display={'flex'}>
                                <Input
                                    variant="filled"
                                    // bg="#E0E0E0"
                                    bg={bg2}
                                    color={color}
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                                <Button bg={bg2} onClick={sendMessageUsingIcon}>
                                    <IoSend size={30} />
                                </Button>
                            </Box>
                        </FormControl>
                    </Box>
                </>
            ) : (
                // to get socket.io on same page
                <Flex minH={'100%'} minW={"100%"} alignItems={'center'} justifyContent={'center'}>

                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                </Flex>
            )}
        </>
    )
}

export default SingleChat
