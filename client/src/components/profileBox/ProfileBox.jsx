import { Box, Image } from '@chakra-ui/react'
import { ChatState } from '../../context/Chatprovider';
import ProfileBoxModal from './ProfileBoxModal'
import { CameraAltOutlined, WifiRounded } from "@material-ui/icons"

export const ProfileBox = ({ setFetchAgain, fetchAgain }) => {
  const { user } = ChatState();


  return (
    <Box d={"flex"} flexDir={"column"} alignItems={"center"} marginTop={"1em"}>
      <Box d={"flex"} flexDir="column" alignItems={"center"} >
        <ProfileBoxModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>

          <Box width={"175px"} cursor="pointer" height={"175px"} position="relative" overflow="hidden" borderRadius="full">

            <Image objectFit={"cover"} src={user?.pic || "https://bit.ly/dan-abramov"} width={"100%"} borderRadius={"full"} alt='Dan Abramov' />
            <div className="secondaryPhoto">

            </div>
            <CameraAltOutlined style={{ position: "absolute", right: "80px", bottom: "8px", opacity: "1", color: "white" }} />
          </Box>
        </ProfileBoxModal>
        <Box marginBottom={"20px"} >
          <Box margin={"10px 0 "} fontSize={"1.8em"} letterSpacing="1.8px"> {user?.userName}</Box>
          <Box d="flex" alignItems={"center"}>

            <button className='profileBoxfollowingBtn'> <strong>Followings : </strong>{user?.followings.length}</button>
            <button className='profileBoxfollowingBtn'> <strong>Followers :  </strong>{user?.followers.length}</button>
          </Box>
        </Box>
      </Box>
      <Box display={"flex"} margin={"20px 0 "} padding={"15px"} alignItems={"center"} justifyContent="space-between" flexDir={"column"}>
        <img className='getChat' src={"svg/getchat.svg"} alt="startchat" />
        <p className='getChatText' >Select the chat to Start conversation</p>
      </Box>
    </Box>

  )
}
