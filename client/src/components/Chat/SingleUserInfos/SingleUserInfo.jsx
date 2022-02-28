import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Image, Input, Spinner, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ChatState } from '../../../context/Chatprovider'
import "./singleUserInfo.css"
import { Check } from "@material-ui/icons"
import { getSenderFull, getSenderId } from "../../../config/senderLogic"
import axios from 'axios'
import Chatloading from '../ChatLoading/Chatloading'
import UserListItem from '../../userListItem/UserListItem'
export const SingleUserInfo = () => {
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
                    console.log("pushed")
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
                selectedChat && (<Box flex={3} display={{ base: "none", md: "block" }}     >
                    <Box d="flex" justifyContent={"center"} alignItems={"center"} flexDir={"column"} padding="4px">
                        <Box d="flex" alignItems={"center"} justifyContent={"center"} borderRadius={'full'} width={"150px"} height={"150px"} marginY={"10px"}>
                            <Image objectFit={"cover"} borderRadius={"full"} width={"150px"} height={"150px"} className='s_userInfoImg' src={selectedUserObj.pic} />
                        </Box>
                        <Box marginY={"1"} width="100%">
                            <Box padding={"10px"} d="flex" w={"100%"} justifyContent="center" d="flex" flexDir={"column"} alignItems="flex-start">
                                <Box textAlign={"center"}>

                                    <h3 className='s_chatInfoName'>{selectedUserObj?.userName}</h3>
                                </Box>
                                <Box d={"flex"} alignItems={"center"} justifyContent={"center"}>

                                    <div className=" s_chatInfoList">
                                        <strong className='s_chatInfoTitle'>Followings:</strong>
                                        <span className='s_chatInfoItem'>{selectedUserObj.followings?.length}</span>
                                    </div>
                                    <div className="s_chatInfoList">
                                        <strong className='s_chatInfoTitle'>Followers:</strong>
                                        <span className='s_chatInfoItem'>{selectedUserObj.followers?.length + followed ? 1 : 0}</span>
                                    </div>
                                </Box>
                                <button className={followed ? "followed" : 'followUser'} onClick={() => handleFollow(selectedUserId)} >{followed ? <>Firends <Check style={{ margin: "0 3px", marginBottom: "3px" }} /></> : "Follow"}</button>

                            </Box>
                        </Box>
                    </Box>
                </Box >
                )
            }

        </>
    )
}
