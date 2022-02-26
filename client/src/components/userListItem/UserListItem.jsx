import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

export default function UserListItem({ user, handleUser, removeUser }) {
    return <Box onClick={handleUser} bg={"#E8E8E8"} borderRadius={"sm"} margin={"4px 0"} color={"black"} _hover={{
        backgroundColor: "purple.200", color: "#333"
    }} cursor={"pointer"} width={"100%"} d={"flex"} bg="#f1f2f6" padding={"8px"} alignItems={"center"} justifyContent={"space-between"}>


        <Box d={"flex"}>  <Avatar mr={2} src={user.pic} name={user.userName} size={"md"} borderRadius={"full"} />
            <Box>
                <Text fontWeight={"bold"} letterSpacing={"1.3px"}>{user.userName}</Text> <Text color={"#2C3A47"} fontSize="xs" fontWeight={"700"} letterSpacing={"1.3px"}>  {user.email} </Text>

            </Box>
        </Box>
        {
            removeUser && <CloseIcon onClick={removeUser} />

        }
    </Box>;
}
