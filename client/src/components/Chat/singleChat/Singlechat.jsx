import { Box, FormControl, IconButton, Image, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons"
import React, { useEffect, useRef, useState } from 'react';
import { getSender, getSenderFull } from "../../../config/senderLogic"
import GroupChatModel from "../../groupchatModal/GroupChatModal"
import ProfileModel from "../../profilemodel/Profilemodel"
import axios from 'axios';
import "../../../style.css"
import ScrollabeChat from '../../reactScrollabeChat/ScrollabeChat';
import { io } from "socket.io-client"
import { ChatState } from '../../../context/Chatprovider';
import { ProfileBox } from "../../profileBox/ProfileBox"
export default function Singlechat({ fetchAgain, setFetchAgain }) {

  const socket = useRef();
  const { user, selectedChat, setSelectedChat, notifications, setnotifications } = ChatState()
  const [messages, setMessages] = useState([])
  const [newMessages, setnewMessages] = useState("")
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [socketconnected, setSocketConnected] = useState(false)
  const [senderFullInfo, setSenderFullInfo] = useState([])
  const [dbNotifications, setdbNotifications] = useState([])
  const toast = useToast();

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    user && socket.current.emit("setup", user?._id);
    socket.current.on("connection", () => {
      setSocketConnected(true)
    })


  }, [user])


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


        // const setnotificationsApi = await axios.post("http://localhost:8000/api/notification", {
        //   message: data._id,
        //   typeOf: "message",
        //   users: [
        //     user._id,
        //     getSenderFull(user, selectedChat.users)
        //   ]
        // })

        // setnotificationsApi.data && setdbNotifications([setnotificationsApi.data, ...dbNotifications])

        setMessages([...messages, data])
        socket.current.emit("new Message", data)

      } catch (err) {
        console.log(err)
        toast({
          title: 'failed to sent message.',
          status: 'error',
          duration: 3000,
          position: "top-left",
          isClosable: true,
        })

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
        setTyping(false);
      }
    }, timerLength);
  };


  useEffect(() => {
    fetchMessage()

  }, [selectedChat, user])

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

          <IconButton onClick={() => setSelectedChat(null)}
            icon={<ArrowBackIcon />} />

          <Text fontSize={{ base: "28px", md: "20px" }}
            fontWeight={700}
            className="senderName"

            p={4}
          >
            {
              selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users)
            }




            <IconButton d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />} />


          </Text>
          {
            !selectedChat.isGroupChat ?
              <ProfileModel user={getSenderFull(user, selectedChat?.users)} >
                <Image
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

        </Box>


        <Box
          overflowY="scroll"
          w={"100%"}
          bg={"white"}
          p={4}
          height={"70%"}
          maxH={"77%"}
          flexDir={"column"}
          d={"flex"}
          alignItems={"center"}
          borderRadius={"lg"}
          overflowY="scroll"
        >
          <Box className='senderInfo' >


            <Image
              src={senderFullInfo?.pic}
              borderRadius={"full"}
              w="150px"
              height={"150px"}
              objectFit={"cover"}
            />
            {/* <p className='senderInfoName'>{senderFullInfo?.userName}</p> */}
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
              </div>
            </>}
        </Box>
        {
          !loading && <FormControl position={"relative"} onKeyDown={sendMessage} isRequired mt={3} >
        
            <Input value={newMessages} borderRadius={"0"} opacity={"0.8"} variant={"filled"} border="none" borderBottom={"2px solid gray"} bg="E0E0E0" placeholder='Enter a message' onChange={(e) => typingHandler(e)} />

          </FormControl>
        }
      </>
        : <ProfileBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
    </Box>
  </>;
}
