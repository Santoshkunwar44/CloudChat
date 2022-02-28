import { React, useState } from 'react';
import { ChatState } from '../../context/Chatprovider';
import Sidedrawer from '../../components/sidedrawer/Sidedrawer'
import { Box } from '@chakra-ui/react';
import Chatbox from '../../components/Chat/chatBox/Chatbox';
import Mychats from '../../components/Chat/mychats/Mychats';
export default function Chatpage() {

    const [fetchAgain, setFetchAgain] = useState(false)
    const { user,selectedChat } = ChatState()

    return <Box width={"100%"} maxHeight={{ base:selectedChat ? "100vh" : "auto", md: "100vh" }} height={{ base: selectedChat?"100vh" :"auto", md: "100vh" }} >

        {user && <Sidedrawer />}
        <Box flexDir={{ base: "column-reverse", md: "row" }} d="flex" width="100%" height={"90%"}>
            <Mychats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>

    </Box>;
}
