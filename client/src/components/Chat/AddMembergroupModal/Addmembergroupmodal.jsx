import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    useDisclosure,
    useToast,
    Box,
    Text,
    Button,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ChatState } from '../../../context/Chatprovider'
import UserListItem from '../../userListItem/UserListItem'
import Chatloading from '../ChatLoading/Chatloading'
import UserBatch from "../../userbatch/UserBatch"
export const Addmembergroupmodal = ({ children, chatMembers, setFetchAgain, fetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [currentMembers, setcurrentMembers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUser, setselectedUser] = useState([])
    const [loading, setLoading] = useState(false);
    const [gotUser, setGotuser] = useState(true)
    const toast = useToast();

    // SEARCH THE USER 
    useEffect(() => {
        setcurrentMembers(chatMembers)
    }, [chatMembers])
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
            setSearchResult(data)
            setLoading(false)
            if (data.length < 1) {
                setGotuser(false)
            } else {
                setGotuser(true)
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
    const handleSelect = (user1) => {
        if (user1._id === user._id) return;
        if (currentMembers.some((s) => s._id === user1._id)) {
            toast({
                title: 'User is already exists in Group.',
                status: 'warning',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
            console.log("alreday exits ")
            return;
        }

        if (selectedUser.includes(user1)) {
            toast({
                title: 'User is already Added.',
                status: 'warning',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
        } else {
            setselectedUser([...selectedUser, user1])
            console.log(selectedUser, "selected")
        }
    }



    // handleSubmit 

    const handleSubmit = async () => {

        if (selectedUser.length < 1) {
            toast({
                title: 'Please select a user.',
                status: 'warning',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        const requestBody = {
            chatid: selectedChat?._id,
            userId: JSON.stringify(selectedUser.map((f) => f._id))
        }

        try {

            const { data } = await axios.put("http://localhost:8000/api/chat/adduser", requestBody, config)
            if (data) {
                setFetchAgain(!fetchAgain)
                setSelectedChat((prev) => (
                    { ...prev, users: [...prev.users, ...selectedUser] }
                ))
                toast({
                    title: "Succesfully added ",
                    status: "success",
                    duration: 3000,
                    position: "bottom-left",
                    isClosable: true,
                })
            }
            onClose()
        } catch (err) {
            toast({
                title: "Some Error Occured",
                status: "error",
                duration: 3000,
                position: "bottom-left",
                isClosable: true,

            })

        }
    }
    const handleClear = async (user1) => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        const requestBody = {
            chatId: selectedChat?._id,
            userId: user1._id
        }
        try {
            const { data } = await axios.put("http://localhost:8000/api/chat/removeuser", requestBody, config);
            if (data) {
                setSelectedChat((prev) => ({
                    ...prev, users: prev.users.filter(e => e._id !== user1._id)
                }))
                setFetchAgain(!fetchAgain)
                toast({
                    title: "Succesfully removed ",
                    status: "success",
                    duration: 3000,
                    position: "bottom-left",
                    isClosable: true,

                })

            }
        } catch (err) {
            toast({
                title: "Some Error Occured",
                status: "error",
                duration: 3000,
                position: "bottom-left",
                isClosable: true,

            })
            console.log(err)
        }



    }

    const handleUnselect = (aUser) => {

        if (!selectedUser.includes(aUser)) return;
        setselectedUser(selectedUser.filter((f) => f._id !== aUser._id))
        console.log(selectedUser, "unselected")

    }

    console.log("chat members all ", selectedChat?.users)
    return (
        <>
            <span onClick={onOpen}> {children}</span>
            <Modal isOpen={isOpen} onClose={onClose} padding={"22px"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add More Friends</ModalHeader>
                    <ModalCloseButton onClick={() => { setSearchResult([]); setselectedUser([]); onClose() }} />
                    <ModalBody textAlign={"center"}>
                        <Input onChange={(e) => handleSearch(e.target.value)} placeholder='Search Friends ' />
                        <Text marginY={"8px"} fontWeight={"600"} letterSpacing={"1.3px"}> GROUP MEMBERS</Text>
                        <Box d={"flex"} flexWrap={"wrap"} justifyContent={"space-around"} alignItems={"center"}>
                            {
                                currentMembers?.map((e) => {
                                    return <UserBatch key={e._id} user={e} handleClear={() => handleClear(e)} />
                                })
                            }
                        </Box>
                        <Box>
                            {
                                loading ? <Chatloading GroupChatModal={true} /> : searchResult.slice(0, 4).map((userItem) => (
                                    <UserListItem handleUnselect={() => handleUnselect(userItem)} isSelected={selectedUser?.some((s) => s._id === userItem._id)} key={userItem._id} user={userItem} handleUser={() => handleSelect(userItem)} />
                                ))
                            }
                        </Box>
                        <Button bg={"pink.500"} _hover={{ bg: "pink" }} onClick={() => handleSubmit()}>Add</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>

    )
}
