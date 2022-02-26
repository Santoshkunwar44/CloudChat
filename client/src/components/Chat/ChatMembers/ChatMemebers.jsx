import { Avatar, Box, Image, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSender, getSenderFull } from '../../../config/senderLogic';
import { ChatState } from '../../../context/Chatprovider';

export default function ChatMemebers({ chat }) {

    const { user: currUser, selectedChat, setSelectedChat, } = ChatState();
    const [nextUser, setNextUser] = useState({})
    useEffect(() => {
        setNextUser(getSenderFull(currUser, chat?.users))
    }, [currUser, chat])


    return <Box
        onClick={() => setSelectedChat(chat)}
        cursor={"pointer"}
        my={1}
        color={selectedChat === chat ? " white" : "black"}
        _hover={{ bg: "purple.100", boxShadow: " 0 1px 2px 0 #a29bfe, 0 1px 3px 1px #a29bfe" }}
        key={chat._id}
        borderRadius={"4px"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={selectedChat && "center"}
        d={"flex"}
        py="5px"
        px="6px"
        marginTop={selectedChat ? "2" : "2"}

    >
        {
            nextUser?.pic ? <Image objectFit={"cover"} className={selectedChat?._id === chat._id ? "selectedChat" : "chatMemberAvatar"} src={nextUser?.pic || "https://bit.ly/dan-abramov"} width={selectedChat ? "50px " : "55px"} height={selectedChat ? "50px" : "55px"} mr={3} size={"md"} borderRadius={"full"} alt='Dan Abramov' /> : <Avatar mr={3} size={"md"} name={getSender(currUser, chat.users)} className={selectedChat?._id === chat._id ? "selectedChat" : "chatMemberAvatar"} />

        }
        <Box display={selectedChat ? "none" : "block"}>
            <Text width={"100%"} fontWeight="bold" letterSpacing={"1.3px"} fontSize={"17px"}>
                {!chat.isGroupChat ? getSender(currUser, chat.users) : chat.chatName}
            </Text>
            <Text className='latestMessage' letterSpacing={"1.2px"} color={"#353b48"} fontWeight={600} fontSize={"12px"}  >{chat.latestMessage?.content}</Text>
        </Box>
    </Box>;
}
