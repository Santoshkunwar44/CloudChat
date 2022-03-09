import { React, useEffect, useState } from 'react';
import { ChatState } from '../../context/Chatprovider';
import Sidedrawer from '../../components/sidedrawer/Sidedrawer'
import { Box } from '@chakra-ui/react';
import Chatbox from '../../components/Chat/chatBox/Chatbox';
import Mychats from '../../components/Chat/mychats/Mychats';
import axios from 'axios';
export default function Chatpage() {

    const [fetchAgain, setFetchAgain] = useState(false)
    const { user: currentUser, selectedChat, setUser } = ChatState()

    const fetchUserAgain = async () => {
        console.log("inside the fetch user function")
        const config = {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
        try {
            const res = await axios.get(`http://localhost:8000/api/user/find/${currentUser?._id}`, config);
            localStorage.setItem("userInfo", JSON.stringify(res.data))
            console.log("fetch new user", res)
        } catch (err) {
            console.log(err)

        }

    }
    useEffect(() => {
        if (currentUser) {
            console.log("fetching.................")
            fetchUserAgain()
        }
    }, [currentUser])


    return <Box width={"100%"} maxHeight={{ base: selectedChat ? "100vh" : "auto", md: "100vh" }} height={{ base: selectedChat ? "100vh" : "auto", md: "100vh" }} >

        {currentUser && <Sidedrawer />}
        <Box flexDir={{ base: "column-reverse", md: "row" }} d="flex" width="100%" height={"90%"}>
            <Mychats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>

    </Box>;
}
