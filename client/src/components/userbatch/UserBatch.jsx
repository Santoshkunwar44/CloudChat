import { Avatar, Box, CloseButton, Text } from '@chakra-ui/react';
import React from 'react';

export default function UserBatch({ user, handleClear }) {
    return <Box justifyContent={"space-between"} minWidth={"120px"} width={"120px"} alignItems={"center"} px={"3px"} m={1} py={1} _hover={{ bg: "purple.200" }} borderRadius={"lg"} bg={"purple.300"} colorScheme={"purple"} d={"flex"} variant={"solid"} cursor={"pointer"}>
        <Box alignItems={"center"} d="flex" >
            <Avatar mr={1} src={user.pic} name={user.userName} size={"sm"} borderRadius={"full"} />   <Text fontWeight={700} fontSize={"15px"}>{Array.from(user?.userName).slice(0, 8)}</Text></Box>
        <CloseButton fontSize={"8px"} onClick={handleClear} />
    </Box>

}   
