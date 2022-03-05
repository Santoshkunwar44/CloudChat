import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, FormControl, IconButton, Image, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons"
import React, { useEffect, useRef, useState } from 'react';
import { getSender, getSenderFull, getSenderId } from "../../../config/senderLogic"
import GroupChatModel from "../../groupchatModal/GroupChatModal"
import ProfileModel from "../../profilemodel/Profilemodel"
import axios from 'axios';
import "../../../style.css"
import ScrollabeChat from '../../reactScrollabeChat/ScrollabeChat';
import { io } from "socket.io-client"
import { ChatState } from '../../../context/Chatprovider';
import { ProfileBox } from "../../profileBox/ProfileBox"
import { useDisclosure } from "@chakra-ui/react"
import { Check, MoreVert } from '@material-ui/icons';
import Lottie, { } from "react-lottie"

import TypingAnimation from "../../animation/86723-typing-animation.json"
export default function Singlechat({ fetchAgain, setFetchAgain }) {

  const socket = useRef();
  const { user, selectedChat, setSelectedChat, notifications, setnotifications } = ChatState()
  const [messages, setMessages] = useState([])
  const [newMessages, setnewMessages] = useState("")
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [socketconnected, setSocketConnected] = useState(false)
  const [nextUserTyping, setNextUserTyping] = useState(false)
  const [senderFullInfo, setSenderFullInfo] = useState([])
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()


  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    user && socket.current.emit("setup", user?._id);
    socket.current.on("connection", () => {
      setSocketConnected(true)
    })
  }, [user])


  useEffect(() => {

    socket.current.on("typing", (room) => {
      console.log(room, selectedChat?._id)
      if (selectedChat?._id !== room) return;
      setNextUserTyping(true)
      console.log("is typing", room)
    })

  })

  useEffect(() => {
    socket.current.on("stop typing", (room) => {
      setNextUserTyping(false)
      // console.log("typing stopped")
    })

  })


  console.log("user typing state ", nextUserTyping)

  const fetchMessage = async () => {

    setSenderFullInfo(getSenderFull(user, selectedChat?.users));
    if (!selectedChat) return
    setLoading(true)
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      },
    }

    try {


      const { data } = await axios.get(`http://localhost:8000/api/message/${selectedChat._id}`, config)
      setMessages(data)
      setLoading(false)


      socket?.current?.emit("join Chat", selectedChat?._id)

    } catch (err) {
      toast({
        title: 'failed to fetch message.',
        status: 'error',
        duration: 3000,
        position: "top-left",
        isClosable: true,
      })
    }


  }







  //SEND MESSAGE 
  const sendMessage = async (e) => {


    // socket.current.emit("stop typing", selectedChat?._id)
    if (e.key === "Enter" && newMessages) {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }
      setnewMessages("")
      try {

        const { data } = await axios.post("http://localhost:8000/api/message", {

          content: newMessages,
          chatId: selectedChat._id,

        }, config);


        setMessages([...messages, data])
        socket.current.emit("new Message", data)
        setNextUserTyping(false)
      } catch (err) {
        console.log(err)
        toast({
          title: 'failed to sent message.',
          status: 'error',
          duration: 3000,
          position: "top-left",
          isClosable: true,
        })
        setNextUserTyping(false)
      }
    }
  }





  useEffect(() => {
    socket.current.on("message received", (data) => {
      if (!selectedChat || selectedChat._id !== data.chat._id) {

        if (notifications.includes(data)) return;
        setnotifications([data, ...notifications])
        setFetchAgain(!fetchAgain)

      } else {
        setMessages([...messages, data])
      }
    })
  })


  useEffect(() => {
    socket.current.on("message received", (data) => {
      if (selectedChat && selectedChat._id === data.chat._id) {
        setMessages([...messages, data])
      } else {
        if (notifications.includes(data)) return;
        setnotifications([data, ...notifications])
        setFetchAgain(!fetchAgain)
      }
    })
  })




  const typingHandler = (e) => {
    setnewMessages(e.target.value);
    if (!socketconnected) return;
    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;


    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChat._id);
      }
      setTyping(false);
    }, timerLength);
  };


  useEffect(() => {
    fetchMessage()

  }, [selectedChat, user])




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
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TypingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <>
    <Box height={"100%"} textAlign={"center"} flex={selectedChat ? 8 : 12}
    >
      {selectedChat ? <>
        <Box
          w={"100%"}
          bg={'white'}
          d={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={4}
        >
          <Box justifyContent={"space-between"} alignItems="center" width={"150px"} d={"flex"}>

            <IconButton marginRight={"14px"} borderRadius={"3px"} padding={"0 8px"} bg={"purple.400"} _hover={{ bg: "#ffffff", color: "purple.500", border: "2px solid #8c7ae6" }} size={"md"} color="#ffffff" onClick={() => setSelectedChat(null)}
              icon={<ArrowBackIcon fontSize={"2xl"} />} />

            <Text fontSize={{ base: "28px", md: "20px" }}
              fontWeight={700}

              cursor={"pointer"}
              className="senderName"
            >
              {
                selectedChat?.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users)
              }

            </Text>
          </Box>
          {
            !selectedChat.isGroupChat ?
              <ProfileModel user={getSenderFull(user, selectedChat?.users)} >
                <Image
                  display={{ base: "none", md: "block" }}
                  src={senderFullInfo?.pic}
                  borderRadius={"full"}
                  w="50px"
                  height={"50px"}
                  objectFit={"cover"}
                />
              </ProfileModel> : <>
                <GroupChatModel setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
              </>
          }

          <Box display={{ md: "none" }}>

            <MoreVert style={{ fontSize: "2.5em" }} cursor="pointer" onClick={onOpen} />

          </Box>


        </Box>


        <Box
          overflowY="scroll"
          w={"100%"}
          bg={"white"}
          p={4}
          height={"76%"}
          maxH={"77%"}
          flexDir={"column"}
          d={"flex"}
          alignItems={"center"}
          borderRadius={"lg"}
        >
          <Box className='senderInfo' >

            <Image
              src={senderFullInfo?.pic}
              borderRadius={"full"}
              w="150px"
              height={"150px"}
              objectFit={"cover"}
            />
          </Box>

          {
            loading ? <Spinner size="xl" height={20} width={20} margin="auto " alignSelf={"center"} /> : <>
              <div className='messageBox' style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                {
                  messages.length < 1 ? <Box className='startConversationBox' >
                    <img className='startchatImg' src="svg/startchat.svg" alt="startchat" />
                    <p className='startConversationText'>    {selectedChat.isGroupChat ? `START CONVERSATION IN ${selectedChat.chatName}` : ` START CONVERSATION WITH ${getSender(user, selectedChat.users)}`} </p>
                  </Box> : <ScrollabeChat messages={messages} />
                }

                <Box>

                </Box>


              </div>
            </>}

        </Box>


        <Box position={"relative"} float="left" justifySelf={"start"}  >
          {nextUserTyping ? <Lottie
            options={defaultOptions}
            width={40}
          /> : "not typing"}
        </Box>


        {
          !loading && <FormControl position={"relative"} onKeyDown={sendMessage} isRequired mt={3} >

            <Input wordBreak={"break-word"} value={newMessages} borderRadius={"0"} opacity={"0.8"} variant={"filled"} border="none" letterSpacing={"1.5px"} borderBottom={"2px solid #34495e"} bg="E0E0E0" placeholder='Enter a message' onChange={(e) => typingHandler(e)} />

          </FormControl>
        }
      </>
        : <ProfileBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
      <>

        <Drawer placement='right' onClose={onClose} isOpen={isOpen} >

          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader className='searchText'>
            </DrawerHeader>
            <DrawerBody>
              <Box>
                <Box d="flex" justifyContent={"center"} alignItems={"center"} flexDir={"column"} padding="4px">
                  <Box d="flex" alignItems={"center"} justifyContent={"center"} borderRadius={'full'} width={"150px"} height={"150px"} marginY={"10px"}>
                    <Image objectFit={"cover"} borderRadius={"full"} width={"150px"} height={"150px"} className='s_userInfoImg' src={selectedUserObj?.pic} />
                  </Box>
                  <Box marginY={"1"} d={"flex"} flexDirection="column" justifyContent={"center"} width="100%">
                    <Box padding={"10px"} d="flex" w={"100%"} flexDir={"column"} alignItems="flex-start">
                      <h3 className='s_chatInfoName'>{selectedUserObj?.userName}</h3>
                      <div className=" s_chatInfoList">
                        <strong className='s_chatInfoTitle'>Followings:</strong>
                        <span className='s_chatInfoItem'>{selectedUserObj?.followings?.length}</span>
                      </div>
                      <div className="s_chatInfoList">
                        <strong className='s_chatInfoTitle'>Followers:</strong>
                        <span className='s_chatInfoItem'>{selectedUserObj?.followers?.length + followed ? 1 : 0}</span>
                      </div>

                    </Box>
                  </Box>
                  <button className={followed ? "followed" : 'followUser'} onClick={() => handleFollow(selectedUserId)} >{followed ? <>Firends <Check style={{ margin: "0 3px", marginBottom: "3px" }} /></> : "Follow"}</button>
                </Box>
              </Box >
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </Box>
  </>;
}
