import { Box, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ChatState } from '../../../context/Chatprovider'
import "./singleUserInfo.css"
import { getSenderFull, getSenderId } from "../../../config/senderLogic"
import axios from 'axios'
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
                    var newFollowings = newuser.followings.filter((e) => e !== id)
                    newuser.followings = newFollowings;
                } else {
                    newuser.followings.some((e) => e !== id) && newuser.followings.push(id);
                }
                console.log("sured ")
                localStorage.setItem("userInfo", JSON.stringify(newuser))
            }



            setfollowed(!followed)
        } catch (err) {
            console.log(err)
        }



    }


    return (
        <Box flex={3} display={{ base: "none", md: "block" }, !selectedChat && "none"}     >
            <Box d="flex" alignItems={"center"} flexDir={"column"} padding="4px">
                <Box d="flex" alignItems={"center"} justifyContent={"center"} borderRadius={'full'}   width={"150px"} height={"150px"} marginY={"20px"}>

                    <Image objectFit={"cover"}  borderRadius={"full"}  width={"100%"} height={"100%"} className='s_userInfoImg' src={selectedUserObj.pic} />
                </Box>
           
                <Box marginY={"2"}>
                    <Box><h3 className='s_chatInfoName'>{selectedUserObj.userName}</h3>
                        <div className=" s_chatInfoList"> <strong className='s_chatInfoTitle'>Followings:</strong> <span className='s_chatInfoItem'>{selectedUserObj.followings?.length}</span> </div>
                        <div className="s_chatInfoList"> <strong className='s_chatInfoTitle'>Followers:</strong> <span className='s_chatInfoItem'>{selectedUserObj.followers?.length + followed ? 1 : 0}</span></div>

                    </Box>
                </Box>
                <button className='followUser' onClick={() => handleFollow(selectedUserId)} >{followed ? "Unfollow" : "Follow"}</button>
            </Box>
        </Box >
    )
}
