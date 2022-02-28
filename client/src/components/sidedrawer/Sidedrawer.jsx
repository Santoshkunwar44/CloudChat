import React, { useRef, useState } from 'react';
import { ChatState } from '../../context/Chatprovider';
import { Avatar, Box, Button, color, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, effect, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Profilemodel from '../profilemodel/Profilemodel';
import axios from 'axios';
import Chatloading from "../Chat/ChatLoading/Chatloading"
import UserListItem from '../userListItem/UserListItem';
import Notification from '../notifications/Notification';
import { NotificationImportantOutlined, NotificationsActiveSharp } from "@material-ui/icons"
import NotificationBadge, { Effect } from 'react-notification-badge';
export default function Sidedrawer() {



    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const navigate = useNavigate()
    const [gotuser, setgotuser] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const searchRef = useRef()
    const toast = useToast()


    const { user, chats, setSelectedChat, notifications, setnotifications, setChats } = ChatState()
    //--------------LOGOUT FUNCTIONALITY 

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    }
    //---------------searching the user 
    const handleClick = async () => {

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }

            const { data } = await axios.get(`http://localhost:8000/api/user?search=${searchRef.current.value}`, config)
            setSearchResult(data)
            setLoading(false)
            if (data.length < 1) {
                data.length < 1 && setgotuser(false)

            } else {

                setgotuser(true)
            }



        } catch (err) {
            toast({
                title: 'User not found.',
                status: 'error',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
            setLoading(false)
        }
    }



    //   ------------ACCESS THE CHAT OF THE USER 

    const accessChat = async (userId) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
        }

        try {
            setLoadingChat(true)
            const { data } = await axios.post("http://localhost:8000/api/chat", { userId }, config)
            if (!chats.find((chat) => chat._id === data._id)) {
                setChats([data, ...chats])
                console.log("its new so added")
            }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose();
        } catch (err) {
            toast({
                title: 'Cannot find Chat.',
                status: 'error',
                duration: 3000,
                position: "top-left",
                isClosable: true,
            })
            setLoadingChat(false)
            console.log(err)

        }
    }




    return <>
        <Box d="flex"
            bg={"white"}
            position={"sticky"}
            top={"0"}
            alignItems={"center"}
            zIndex={"88"}
            height={"10vh"}
            padding={{ base: "10px 0 ", md: "10px 15px" }}>


            <Box alignItems={"center"} d="flex" justifyContent={"space-between"} flex={[
                "7",
                "9",
                "8",
                "8"

            ]}>
                <Box textAlign="center" padding={"0 20px"} fontSize={[
                    '17px', // 0-30em
                    '20px', // 30em-48em
                    '2em', // 48em-62em
                    '2.3em', // 62em+
                ]} className='chatNameTop' display={[
                    "none",
                    "block",
                    "block",
                    "block",
                ]}>
                    Cloud Chat
                </Box>
                <Tooltip label="Search users to chat">
                    <Button padding={"5px 15px"} width={["200px", "300px", "250px", "300px"]} border={"2px solid #8c7ae6"} onClick={onOpen} variant={"ghost"}>
                        <i style={{ marginLeft: "20px" }} className="fas fa-search" ></i>
                        <Text fontSize={[
                            "15px",
                            "12px",
                            "14px",
                            "20px"
                        ]} px={"4"} className=""> Search for new Friends </Text></Button>

                </Tooltip>

            </Box>


            <Box d="flex" justifyContent={"space-between"} padding={"0 15px"} className='topIcons' flex={
                [
                    "5",
                    "3",
                    "4",
                    "4",
                ]
            }>
                <Menu >
                    <MenuButton position={"relative"}>
                        <NotificationBadge
                            count={notifications.length}
                            effect={Effect.SCALE}
                        />
                        <NotificationsActiveSharp style={{ color: "ButtonShadow" }} fontSize={"34px"} />
                        <div style={{ position: "absolute", top: "0px", right: "0px", fontWeight: " 600", color: "red" }}> {notifications.length >= 1 && notifications.length}</div>
                    </MenuButton>
                    {
                        !notifications.length < 1 ? <MenuList>
                            {
                                notifications?.map((chat) => (
                                    <MenuItem>
                                        <Notification chats={chat} key={chat._id} setSelectedChat={setSelectedChat} />
                                    </MenuItem>
                                ))
                            }
                        </MenuList> : <MenuList padding={"5px"}>No Notification</MenuList>
                    }

                </Menu>
                <Menu>
                    <MenuButton as={Button} padding={""} d="flex" alignItems={"center"} >
                        <i style={{ fontSize: "23px", marginRight: "15px" }} className="fas fa-angle-down"></i>
                        <Avatar size="sm" cursor="pointer" name={user.userName} src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <Profilemodel user={user}>
                            <MenuItem>
                                My Profile
                            </MenuItem>
                        </Profilemodel>

                        <MenuDivider />
                        <MenuItem onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    </MenuList>

                </Menu>
            </Box>
        </Box>
        {/* ////////////////DRAWEWWR */}
        <Drawer placement='left' onClose={onClose} isOpen={isOpen} >

            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader className='searchText'>
                    Search for Friends
                </DrawerHeader>
                <DrawerBody>
                    <Box d="flex" pb={2}>
                        <Input onChange={handleClick} ref={searchRef} mr={2} outline={"none"} placeholder='Search by Email or username' />

                    </Box>
                    {loading ? <Chatloading /> : (searchResult?.map(e => (
                        <UserListItem key={user._id} handleUser={() => accessChat(e._id)} user={e} />
                    )))}
                    {loadingChat && <Spinner ml={"auto"} d={"flex"} />}
                    {!gotuser && <div className='noUserBox'>

                        <img className='noUserImg' src="images/usernotfound.png" />
                        <span className='Notfound'> User not Found</span>
                    </div>}
                </DrawerBody>
            </DrawerContent>


        </Drawer>


    </>
}
