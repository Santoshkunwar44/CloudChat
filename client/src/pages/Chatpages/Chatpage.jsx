import { React, useState } from 'react';
import { ChatState } from '../../context/Chatprovider';
import Sidedrawer from '../../components/sidedrawer/Sidedrawer'
import { Box } from '@chakra-ui/react';
import Chatbox from '../../components/Chat/chatBox/Chatbox';
import Mychats from '../../components/Chat/mychats/Mychats';
export default function Chatpage() {

    const [fetchAgain, setFetchAgain] = useState(false)
    const { user } = ChatState()

    return <div style={{ width: "100%", maxHeight: "100vh", height: "100vh" }}>

        {user && <Sidedrawer />}
        <Box d="flex" width="100%" height={"90%"}>
            <Mychats fetchAgain={fetchAgain} />
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>

    </div>;
}
