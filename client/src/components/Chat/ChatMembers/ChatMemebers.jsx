import { Avatar, Box, Button, Image, Popover, PopoverContent, PopoverTrigger, Portal, Text, toast, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSender, getSenderFull } from '../../../config/senderLogic';
import { ChatState } from '../../../context/Chatprovider';
import "../../../Sec_app.js"
import { MoreVert } from "@material-ui/icons"
import axios from 'axios';

export default function ChatMemebers({ chat, setFetchAgain, fetchAgain, setChats }) {

    const { user: currUser, selectedChat, setSelectedChat, } = ChatState();
    const [showOptions, setShowOptions] = useState(false)
    const [nextUser, setNextUser] = useState({})
    const [option, setOption] = useState(false)
    const toast = useToast()
    useEffect(() => {
        setNextUser(getSenderFull(currUser, chat?.users))
    }, [currUser, chat])

    const handleOption = () => {
        setShowOptions(true)
    }
    const mouseLeaveHandle = () => {
        setShowOptions(false)
    }

    const leaveGroup = async () => {

        if (chat.isGroupChat) {

            const config = {
                headers: {
                    Authorization: `Bearer ${currUser.token}`
                },
            }

            const body = {
                chatId: chat._id,
                userId: currUser._id,
            }
            const { data } = await axios.put("http://localhost:8000/api/chat/removeuser", body, config)
            if (data) {
                toast({
                    title: 'You left the group.',
                    status: 'success',
                    duration: 3000,
                    position: "top-left",
                    isClosable: true,
                })
                setFetchAgain(!fetchAgain)
            }
        }
    }


    const handleDeleteChat = async () => {

        const config = {
            headers: {
                Authorization: `Bearer ${currUser.token}`
            }
        }
        const body = {
            userId: currUser._id,
            chatId: chat._id,
            deletedAt: Date.now(),
        }

        try {

            const { data } = await axios.put("http://localhost:8000/api/chat/deleteChat", body, config)
            if (data) {
                setChats((prev) => prev.filter((item) => {
                    return item._id !== chat?._id
                }))

                let newUser = { ...currUser }

                let ide = chat._id;

                if (newUser.deletedChat?.length >= 1) {
                    if (newUser.deletedChat.some((e) => e.chatId !== ide)) {
                        newUser.deletedChat.push(body)
                    }
                } else {
                    console.log("does not haave deleted chat")
                    newUser.deletedChat = [body]
                }

                localStorage.setItem("userInfo", JSON.stringify(newUser))
                // setFetchAgain(!fetchAgain)
                toast({
                    title: 'You deleted the group.',
                    status: 'success',
                    duration: 3000,
                    position: "top-left",
                    isClosable: true,
                })
            }

        } catch (err) {
            toast({

                title: 'Failed to delete  the group.',
                status: 'error',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
        }
    }

    return <Box
        onClick={() => { !option && setSelectedChat(chat) }}
        cursor={"pointer"}
        my={1}
        color={selectedChat === chat ? " white" : "black"}
        _hover={{ bg: "purple.100", boxShadow: " 0 1px 2px 0 #a29bfe, 0 1px 3px 1px #a29bfe" }}
        key={chat._id}
        borderRadius={"4px"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={selectedChat && "center"}
        transition="all .2s ease-in"
        d={"flex"}
        py="5px"
        px="6px"
        bg={selectedChat?._id === chat?._id && "purple.200"}
        className='chatMembers'
        marginTop={selectedChat ? "2" : "2"}
        onMouseEnter={() => { handleOption() }}
        onMouseLeave={() => { mouseLeaveHandle() }}
        position="relative"

    >
        {
            nextUser?.pic ? <Image objectFit={"cover"} className={selectedChat?._id === chat._id ? "selectedChat" : "chatMemberAvatar"} src={nextUser?.pic || "https://bit.ly/dan-abramov"} width={selectedChat ? "50px " : "55px"} height={selectedChat ? "50px" : "55px"} mr={3} size={"md"} borderRadius={"full"} alt='Dan Abramov' /> : <Avatar mr={3} size={"md"} name={chat && getSender(currUser, chat?.users)} className={selectedChat?._id === chat._id ? "selectedChat" : "chatMemberAvatar"} />

        }

        <Box display={selectedChat ? "none" : "block"}>
            <Text width={"100%"} fontWeight="bold" letterSpacing={"1.3px"} fontSize={"17px"}>
                {chat && !chat.isGroupChat ? getSender(currUser, chat?.users) : chat.chatName}
            </Text>
            <Text className='latestMessage' letterSpacing={"1.2px"} color={"#353b48"} fontWeight={600} fontSize={"12px"}  >{chat.latestMessage?.content}</Text>
            {showOptions && <>
                <Popover  >
                    <PopoverTrigger>
                        {/* <Button  position={"absolute"} top={"5px"} right={"20px"} onClick={handleChatOption}>Trigger</Button> */}
                        <MoreVert onMouseLeave={() => setOption(false)} onMouseOver={() => setOption(true)} style={{ position: "absolute", color: "gray", bottom: "20px", right: "20px" }} />
                    </PopoverTrigger>
                    <Portal z-index={'1'}>
                        <PopoverContent onMouseLeave={() => setOption(false)} onMouseOver={() => setOption(true)}>
                            <Box padding={"12px 5px"} fontWeight={"600"} _hover={{ bg: "purple.100", boxShadow: " 0 1px 2px 0 #a29bfe, 0 1px 3px 1px #a29bfe" }} cursor={"pointer"} letterSpacing={"1.4px"} fontSize="18px" onClick={handleDeleteChat}>Delete Chat</Box>
                            <Box padding={"12px 5px"} fontWeight={"600"} _hover={{ bg: "purple.100", boxShadow: " 0 1px 2px 0 #a29bfe, 0 1px 3px 1px #a29bfe" }} cursor={"pointer"} letterSpacing={"1.4px"} >Mute Chat</Box>
                            {

                                chat?.isGroupChat && <Box padding={"12px"} fontWeight={"600"} _hover={{ bg: "purple.100", boxShadow: " 0 1px 2px 0 #a29bfe, 0 1px 3px 1px #a29bfe" }} cursor={"pointer"} onClick={() => leaveGroup()} letterSpacing={"1.4px"}  >Leave Group</Box>
                            }

                        </PopoverContent>
                    </Portal>
                </Popover>

            </>}
        </Box>
    </Box>;
}
