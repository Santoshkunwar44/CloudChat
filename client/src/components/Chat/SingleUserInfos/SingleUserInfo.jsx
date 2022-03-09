import { Avatar, AvatarGroup, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Image, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ChatState } from '../../../context/Chatprovider'
import "./singleUserInfo.css"
import { Check } from "@material-ui/icons"
import { getSenderFull, getSenderId } from "../../../config/senderLogic"
import axios from 'axios'
import { Addmembergroupmodal } from '../AddMembergroupModal/Addmembergroupmodal'
export const SingleUserInfo = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat } = ChatState()
    const [selectedUserId, setSelectedUser] = useState(null)
    const [selectedUserObj, setSelectedUserObj] = useState({})
    const [followed, setfollowed] = useState(null)
    console.log(user?.followings.includes(selectedUserId), followed)



    useEffect(() => {

        if (user && selectedChat) {
            setSelectedUser(getSenderId(user, selectedChat?.users));
            setSelectedUserObj(getSenderFull(user, selectedChat?.users))
        }

        if (user?.followings.includes(selectedUserId)) {
            setfollowed(true)
            console.log("setting true")
        } else {
            setfollowed(false)
            console.log("setting false")
        }

    }, [user, selectedChat, selectedUserId])

    const handleFollow = async (id) => {

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        const userId = {
            userId: user?._id
        }

        try {

            const res = followed ? await axios.post(`http://localhost:8000/api/user/${id}/unfollow`, userId, config) : await axios.post(`http://localhost:8000/api/user/${id}/follow`, userId, config)
            let newuser = { ...user }

            if (res.data) {
                if (followed) {
                    console.log("unfollowed")
                    var newFollowings = newuser.followings.filter((e) => e !== id)
                    newuser.followings = newFollowings;
                } else {
                    if (!newuser.followings.includes(id)) {
                        newuser.followings.push(id)
                    }

                }
                console.log(newuser)
                localStorage.setItem("userInfo", JSON.stringify(newuser))
            }



            setfollowed(!followed)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            {
                selectedChat && (<Box height={"100%"} borderLeft={".5px solid #dfe6e9"} flex={3} display={{ base: "none", md: "block" }}>
                    {
                        selectedChat?.isGroupChat ? (
                            <Box height={"100%"} d="flex" justifyContent={"center"} width={"100%"} alignItems={"center"} flexDir={"column"} padding={"5px 10px"} >
                                <Box justifyContent={"space-around"} height={"35%"} width={"100%"} d={"flex"} flexDir="column" alignItems={"center"}>
                                    <AvatarGroup total={selectedChat?.users.length}>
                                        {
                                            selectedChat?.users.slice(0, 4).map((e) => (
                                                <Avatar alt="Remy Sharp" src={e?.pic} />
                                            ))
                                        }
                                    </AvatarGroup>
                                    <Box d={"flex"} width="100%" alignItems={"center"} flexDir="column" justifyContent={"center"}><Text fontSize={"1.3em"} fontWeight={"600"} letterSpacing={"1.4px"}>{selectedChat?.chatName}</Text>
                                        <Text letterSpacing={"1.3px"}>{selectedChat?.users?.length} Members</Text> </Box>
                                    <Addmembergroupmodal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} chatMembers={selectedChat?.users}>
                                        <Button borderRadius={"2px"} fontSize={"15px"} letterSpacing={"1.3px"} bg={"#6c5ce7"} color={"white"} _hover={{ bg: "#a29bfe" }}>Add Member</Button>
                                    </Addmembergroupmodal>
                                </Box>
                                <Box width={"100%"} maxH={"65%"} overflowY="scroll" height="65%" textAlign={"center"}>
                                    {
                                        selectedChat?.users?.map((e, i) => (
                                            <Box padding={"5px"} _hover={{ boxShadow: " 0 1px 2px 0 rgb(48 48 48 / 30%), 0 1px 3px 1px rgb(48 48 48 / 15%)" }} cursor={"pointer"} d={"flex"} alignItems={"center"} margin={"5px 0"} >
                                                <Image marginRight={"13px"} objectFit={"cover"} width={"45px"} height={"45px"} borderRadius={"full"} src={e.pic} />
                                                <Box textAlign={"start"}>
                                                    <Text fontSize={"15px"} letterSpacing={"1.3px"} fontWeight={"600"}>{e?.userName}</Text>
                                                    <Text fontSize={"12px"} letterSpacing={"1px"} fontWeight={"600"} color={"gray"}>{e?.email}</Text>
                                                </Box>
                                            </Box>

                                        ))
                                    }
                                </Box>
                            </Box>
                        ) : <>
                            <Box d="flex" justifyContent={"center"} alignItems={"center"} flexDir={"column"} padding="4px">
                                <Box d="flex" alignItems={"center"} justifyContent={"center"} borderRadius={'full'} width={"150px"} height={"150px"} marginY={"10px"}>
                                    <Image objectFit={"cover"} borderRadius={"full"} width={"150px"} height={"150px"} className='s_userInfoImg' src={selectedUserObj?.pic} />
                                </Box>
                                <Box marginY={"1"} width="100%">
                                    <Box padding={"10px"} alignItems="center" w={"100%"} justifyContent="center" d="flex" flexDir={"column"} >
                                        <Box textAlign={"center"}>

                                            <h3 className='s_chatInfoName'>{selectedUserObj?.userName}</h3>
                                        </Box>
                                        <Box d={"flex"} flexDir="column" alignItems={"center"} justifyContent={"center"}>
                                            <div className=" s_chatInfoList">
                                                <strong className='s_chatInfoTitle'>Followings:</strong>
                                                <span className='s_chatInfoItem'>{selectedUserObj?.followings?.length}</span>
                                            </div>
                                            <div className="s_chatInfoList">
                                                <strong className='s_chatInfoTitle'>Followers:</strong>
                                                <span className='s_chatInfoItem'>{selectedUserObj?.followers?.length + followed ? 1 : 0}</span>
                                            </div>
                                        </Box>
                                        <button className={followed ? "followed" : 'followUser'} onClick={() => handleFollow(selectedUserId)} >{followed ? <>Firends <Check style={{ margin: "0 3px", marginBottom: "3px" }} /></> : "Follow"}</button>
                                    </Box>
                                </Box>
                            </Box>
                        </>

                    }

                </Box >
                )
            }

        </>
    )
}
