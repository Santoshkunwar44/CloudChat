import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { format } from "timeago.js"
import "../../style.css"
import { useRef,useEffect } from "react"
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
                    <div ref={scrollRef} key={e._id} style={{ position: "relative", alignSelf: e.sender._id === user._id ? "flex-end" : "flex-start", display: "flex", alignItems: "center", marginTop: "10px" }} >
                        {user._id !== e.sender._id && <Avatar mr={2} src={e.sender.pic} name={e.sender.userName} />}
                        <Box maxWidth={"300px"} my={3} bg={e.sender._id === user._id ? "purple.400" : "blue.400"} py={2} px={4} wordBreak={"break-all"} borderRadius={"full"} d="flex" alignItems={"center"}>
                            <Text fontSize={"14px"} letterSpacing={"1.2px"} fontWeight={600} >{e.content}</Text>
                        </Box>
                        <span className="time">{format(e.createdAt)}</span>
                    </div>

                </>

            ))

        }

    </>


}