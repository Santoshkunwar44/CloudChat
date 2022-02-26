import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    Box,
    FormControl,
    Input,
    useToast,
    Text,
} from '@chakra-ui/react'
import { ChatState } from '../../context/Chatprovider';
import UserListItem from "../userListItem/UserListItem"
import { SpinnerIcon, ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';
export default function GroupchatmodelModel({ fetchAgain, setFetchAgain }) {

    const { user, selectedChat, setSelectedChat } = ChatState()
    const [searchResults, setsearchResults] = useState([])
    const [newchatName, setchatName] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const toast = useToast();


    //search the new user to add into a group

    const searchFunc = async (searchUser) => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        try {

            const { data } = await axios.get(`http://localhost:8000/api/user?search=${searchUser}`, config)
            console.log(data)
            setsearchResults(data)
            setLoading(false)

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



    // REMOVE THE USER 


    const removeUser = async (user1) => {
        setLoading(true);
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: `Only group admin can remove user in group`,
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

            const { data } = await axios.put(`http://localhost:8000/api/chat/removeuser`, {
                userId: user1._id,
                chatid: selectedChat._id,
            }, config)
            console.log(data)

            setFetchAgain(!fetchAgain)
            setSelectedChat(data)
            toast({
                title: `User removed successfully`,
                status: 'success',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast({
                title: `Failed to remove`,
                status: 'error',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
        }

    }




    // ADD THE USER 






    const handleSelect = async (user1) => {


        setLoading(true)

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: `Only group admin can add user in group`,
                status: 'error',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
            return;
        }

        if (selectedChat.users.find((e) => e._id === user1._id)) {
            toast({
                title: `${user1.userName} is already in Group`,
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

            const { data } = await axios.put(`http://localhost:8000/api/chat/adduser`, {
                userId: user1._id,
                chatid: selectedChat._id,
            }, config)
            console.log(data)

            setFetchAgain(!fetchAgain)
            setSelectedChat(data)
            toast({
                title: `Updated successfully`,
                status: 'success',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast({
                title: `Failed to update`,
                status: 'success',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
        }
    }





    //RENAME THE CHAT 


    const handleUpdate = async () => {
        setLoading(true)
        if (!newchatName) return;
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        try {

            const { data } = await axios.put("http://localhost:8000/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: newchatName
            }, config)
            setFetchAgain(!fetchAgain)
            setSelectedChat(data)
            toast({
                title: 'successfully updated',
                status: 'success',
                duration: 3000,
                position: "bottom-left",
                isClosable: true,
            })
            setchatName("")
            onClose()
            setLoading(false)

        } catch (err) {
            toast({
                title: 'Failed to update.',
                status: 'error',
                duration: 3000,
                position: "bottom-left",
                isClosable: true,
            })
            setLoading(false)
        }
    }


    // REMOVE THE CHAT


    const LeaveChat = async () => {
        setLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }

        try {

            const { data } = await axios.put(`http://localhost:8000/api/chat/removeuser`, {
                userId: user._id,
                chatid: selectedChat._id,
            }, config)

            console.log(data)

            setFetchAgain(!fetchAgain)
            setSelectedChat()
            toast({
                title: `You leaved the  ${selectedChat.chatName} group`,
                status: 'success',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
            setLoading(false)

        } catch (err) {
            setLoading(false)
            toast({
                title: `Failed to  leave the group`,
                status: 'error',
                duration: 3000,
                position: "top",
                isClosable: true,
            })
        }

    }

    return <div>
        <>
            <IconButton onClick={onOpen} icon={<ViewIcon />} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Box>
                            {
                                selectedChat.users.map((e) => {
                                    return <UserListItem key={e._id} user={e} removeUser={() => removeUser(e)} />
                                })
                            }
                        </Box>
                        <FormControl mt={10}>
                            <Input placeholder={selectedChat.chatName} onChange={(e) => setchatName(e.target.value)}  />
                        </FormControl>
                        <FormControl my={2}>
                            <Input onChange={(e) => searchFunc(e.target.value)} placeholder='Add new user' />
                        </FormControl>
                        {
                            loading ? <Box m={3} textAlign={"center"}> <SpinnerIcon fontSize={"33px"} /> </Box> : searchResults.length < 1 ? <Text m={2} fontSize={"20px"} textAlign={"center"}>No user Found </Text> : searchResults.slice(0, 4).map((userItem) => (
                                <UserListItem key={userItem._id} user={userItem} handleUser={() => handleSelect(userItem)} />
                            ))
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={LeaveChat}>
                            Leave
                        </Button>
                        <Button colorScheme='blue' mr={3} onClick={handleUpdate}>
                            Update
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    </div>;
}
