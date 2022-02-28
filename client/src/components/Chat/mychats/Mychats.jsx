import { Box, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect } from 'react';
import { ChatState } from '../../../context/Chatprovider';
import GroupChatModal from '../../groupchatModal/GroupChatModal';
import ChatMemebers from '../ChatMembers/ChatMemebers';


export default function Mychats({ fetchAgain, setFetchAgain }) {

  const { user: currUser, selectedChat, setSelectedChat, setChats, chats } = ChatState();




  // fetching the chat of the currUser 

  const fetchChats = async () => {

    let deletedChats = currUser?.deletedChat;

    // console.log(deletedChats[0]?.deletedAt, deletedChats[1]?.deletedAt)

    if (currUser) {
      const config = {
        headers: {
          Authorization: `Bearer ${currUser?.token}`
        },
      }
      try {
        const { data } = await axios.get("http://localhost:8000/api/chat", config)

        if (deletedChats?.length >= 1) {
          const filtered = data.filter((item) => {
            return deletedChats.every((del) => {
              if (del.chatId !== item._id) {
                return true;
              } else if (del.chatId === item._id) {
                if (del.deletedAt < new Date(item.latestMessage?.createdAt).getTime()) {
                  return true;
                }
              } else {
                return false;
              }
            });
          });
          setChats(filtered)
        } else {

          setChats(data)
        }


      } catch (err) {
        toast({
          title: 'Cannot find Chat.',
          status: 'error',
          duration: 3000,
          position: "top-left",
          isClosable: true,
        })
        console.log(err)
      }
    }
  }

  useEffect(() => {
    fetchChats();

  }, [fetchAgain, currUser])


  const toast = useToast()
  return <Box
    d={{ base: selectedChat ? "none" : "flex", md: "flex" }}

    flexDir={"column"}
    alignItems={"center"}
    p={"3"}
    width={{  md: selectedChat ? "10%" : "45%" }}
    position={"sticky"}
    top={"16"}
    maxHeight={"100%"}
    borderRight={"1px solid gray.100"}

  >
    <Box pb={3}
      px={3}
      fontSize={{ base: "28", md: "30px" }}
      d={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <GroupChatModal display={selectedChat ? "none" : "block"}>

        <Button display={selectedChat ? "none" : "flex"} width={"190px"} bg={"#a55eea"} mb={3} color={"white"} _hover={{ bg: "white", border: "2px solid #a55eea", color: "#a55eea" }} fontSize={{ md: "14px", lg: "17px", base: "17px" }} letterSpacing="1.3px" borderRadius={"2px"}>
          Create Group
          <i style={{ fontSize: "22px", marginLeft: "10px" }} className="fas fa-plus"></i>
        </Button>

      </GroupChatModal>



    </Box>
    <Box width={"100%"} overflowY={"auto"} >


      <div className="chatSvg" style={{ display: selectedChat && "none" }}>

        <img className='chatSvgImg' src="svg/chat.svg" alt="chatsSvg" />
        <p className='chatSvgText' > {chats.length < 1 ? " No any chat Yet !" : " Your all chats !"}</p>
      </div>
      {
        chats ?
          chats?.map((chat) => (
            <ChatMemebers setChats={setChats} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} key={chat._id} chat={chat} setSelectedChat={setSelectedChat} />
          ))
          : <div>No chats</div>
      }

    </Box>
  </Box>;
}
