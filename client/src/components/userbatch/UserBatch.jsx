import { Avatar, Box, CloseButton, Text } from '@chakra-ui/react';
import React from 'react';

export default function UserBatch({ user, handleClear }) {
    return <Box px={3} m={1} py={1} _hover={{ bg: "purple.100" }} borderRadius={"lg"} bg={"purple.300"} colorScheme={"purple"} d={"flex"} variant={"solid"} cursor={"pointer"}>
        <Box >   <Avatar mr={2} src={user.pic} name={user.userName} size={"sm"} borderRadius={"full"} /></Box>
        <Text fontWeight={600} fontSize={"18px"}>{user.userName}</Text>
        <CloseButton onClick={handleClear} />

    </Box>

}   
