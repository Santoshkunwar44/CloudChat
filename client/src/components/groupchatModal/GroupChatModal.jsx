import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Box,
    Spinner,
    Text,
} from '@chakra-ui/react'
import { ChatState } from '../../context/Chatprovider';
import UserListItem from "../userListItem/UserListItem"
import axios from 'axios';
import UserBatch from '../userbatch/UserBatch';
import { Group } from '@material-ui/icons';
export default function GroupChatModal({ children }) {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChat, setGroupChat] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResulsts, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [gotuser, setgotuser] = useState(true)
    const toast = useToast();
    const { user, chats, setChats } = ChatState();



    // SEARCH THE USER 

    const handleSearch = async (query) => {

        if (!query) return;

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8000/api/user?search=${query}`, config)
            setSearchResults(data)
            setLoading(false)
            if (data.length < 1) {
                setgotuser(false)
            } else {
                setgotuser(true)
            }

        } catch (err) {
            setLoading(false)
            toast({
                title: 'Cannot find Users.',
                status: 'error',
                duration: 3000,
                position: "bottom-left",
                isClosable: true,
            })
        }
    }


    // TO MAKE THE GROUP

    const handleSubmit = async () => {

        if (!groupChat || !selectedUsers) {
            toast({
                title: 'Fill all the field.',
                status: 'error',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        try {
            const { data } = await axios.post("http://localhost:8000/api/chat/createGroupChat", {
                name: groupChat,
                users: JSON.stringify(selectedUsers.map((e) => e._id))
            }, config)
            console.log(data)
            setChats([data, ...chats])
            toast({
                title: ` New Group chat ${groupChat}  Created`,
                status: 'success',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
            setSelectedUsers([])
            onClose();

        } catch (err) {

            toast({
                title: ` Failed to create Group chat `,
                status: 'success',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
        }

    }


    // SELECTING THE USERS TO ADD IN THE GROUP

    const handleSelect = (user1) => {

        if (user1._id === user._id) return;

        if (selectedUsers.includes(user1)) {
            toast({
                title: 'User is already Added.',
                status: 'warning',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
        } else {
            setSelectedUsers([...selectedUsers, user1])
        }
    }


    // remove  THE  THE USERS FROM THE  GROUP
    const handleClear = (user1) => {

        const remainingUsers = selectedUsers.filter((e) => e !== user1);
        setSelectedUsers(remainingUsers)

    }

    return (
        <>
            <span onClick={onOpen}> {children}</span>
            <Modal isOpen={isOpen} onClose={() => { setSelectedUsers([]); setSearchResults([]); onClose() }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={"25px"} d={"flex"} alignItems={"center"} justifyContent={"center"}> <Group style={{ fontSize: "52px", color: "#a55eea", marginRight: "10px" }} /> <Text fontSize={"20px"}>Create Groupchat</Text></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d={"flex"} alignItems={"center"} flexDir={"column"} >
                        <FormControl onChange={(e) => setGroupChat(e.target.value)} mb={4}>
                            <Input letterSpacing={"1.3px"} borderRadius={"2px"} padding={"8px"} fontSize={"16px"} placeholder='Group Name ' />
                        </FormControl>
                        <FormControl mb={4}>
                            <Input letterSpacing={"1.3px"} borderRadius={"2px"} padding={"8px"} onChange={(e) => handleSearch(e.target.value)} fontSize={"16px"} placeholder='Search user' />
                        </FormControl>
                        <Box d={"flex"} flexWrap={"wrap"} justifyContent={"space-around"} alignItems={"center"}>
                            {
                                selectedUsers.map((e) => {
                                    return <UserBatch key={e._id} user={e} handleClear={() => handleClear(e)} />

                                })
                            }
                        </Box>
                        {
                            loading ? <div><Spinner /></div> : searchResulsts.slice(0, 4).map((userItem) => (
                                <UserListItem key={userItem._id} user={userItem} handleUser={() => handleSelect(userItem)} />
                            ))
                        }
                        {!gotuser && <div className='noUserBox'>

                            <img className='noUserImgModal' src="images/usernotfound.png" />
                            <span className='Notfound'> User not Found</span>
                        </div>}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='purple' onClick={handleSubmit} letterSpacing={"2px"} borderRadius={"2px"}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
