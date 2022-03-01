import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../../components/Authentication/Login';
import Signup from '../../components/Authentication/Signup';
export default function Home() {
    return <Container maxW='xl' centerContent>

        <Box w={"100%"} bg='white' boxShadow={"0 1px 2px 0 rgb(48 48 48 / 30%), 0 1px 3px 1px rgb(48 48 48 / 15%);"} p={"10px"}>
            <Tabs variant='soft-rounded' colorScheme={"purple"}>
                <TabList m={"1em"}>
                    <Tab className='tabList' w={"50%"}>Login</Tab>
                    <Tab w={"50%"}>SignUP</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
}
