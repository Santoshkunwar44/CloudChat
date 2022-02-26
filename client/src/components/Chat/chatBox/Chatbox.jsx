
import { ChatState } from "../../../context/Chatprovider"
import { Box } from '@chakra-ui/react';
import Singlechat from "../singleChat/Singlechat"
import { SingleUserInfo } from "../SingleUserInfos/SingleUserInfo";

export default function Chatbox({ fetchAgain, setFetchAgain }) {

  const { selectedChat } = ChatState();
  return <Box
    d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
    width={{ base: "100%", md: "100%" }}
    bg={"white"}
    height={"100%"}
    maxHeight={"100%"}

  >
    <Singlechat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    <SingleUserInfo/>


  </Box>
}
