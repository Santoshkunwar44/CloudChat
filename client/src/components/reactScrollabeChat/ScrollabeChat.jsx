import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { format } from "timeago.js"
import "../../style.css"
import { useRef, useEffect } from "react"
import { ChatState } from '../../context/Chatprovider';
export default function ScrollabeChat({ messages }) {
    const scrollRef = useRef()
    const { user } = ChatState()

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return <>
        {
            messages && messages.map((e) => (

                <>
                    <div ref={scrollRef} key={e._id} style={{ position: "relative", cursor: "pointer", alignSelf: e.sender._id === user._id ? "flex-end" : "flex-start", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "14px" }} >
                        <Box minWidth={"70px"}  d="flex" margin={"0"}>

                            {user._id !== e.sender._id && <Avatar mr={2} src={e.sender.pic} name={e.sender.userName} />}
                            <Box boxShadow={e.sender._id === user?._id ? " 0 1px 2px 0 rgb(48 48 48 / 30%), 0 1px 3px 1px  #9c88ff;" : " 0 1px 2px 0 rgb(48 48 48 / 30%), 0 1px 2px 1px #00a8ff;"} purple maxWidth={"300px"} my={3} bg={e.sender._id === user._id ? "purple.400" : "blue.400"} py={1.5} px={4} wordBreak={"break-all"} borderRadius={"full"} d="flex" alignItems={"center"}>
                                <Text fontSize={"14px"} letterSpacing={"1.4px"} fontWeight={600} >{e.content}</Text>
                            </Box>
                        </Box>
                        <Box position={"absolute"} bottom="-15px" fontWeight={"600"} alignSelf={e.sender._id === user?._id ? "self-end" : "self-start"} marginBottom="7px" fontSize={"10.3px"} color={"gray.700"}>{format(e.createdAt)}</Box>
                    </div>

                </>

            ))

        }

    </>


}