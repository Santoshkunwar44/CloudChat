import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/react'
export default function Chatloading({ GroupChatModal }) {
    return <>
        <Stack>
            {
                GroupChatModal ? <>
                    <Skeleton height='40px' />
                    <Skeleton height='40px' />
                    <Skeleton height='40px' />
                    <Skeleton height='40px' /></> :
                    <>
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' /></>
            }


        </Stack></>

}
