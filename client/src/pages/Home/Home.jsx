import React, { useEffect, useRef } from 'react';
import { Box, Container } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../../components/Authentication/Login';
import Signup from '../../components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Home() {

    const navigateLoginRef = useRef();
    const navigate = useNavigate()
    const switchtoLogin = () => {
        navigateLoginRef.current.click();
    }
    const responseGoogleSuccess = async (response) => {

        let LogUser = {
            tokenId: response.tokenId,
        }
        const loguser = await axios.post("http://localhost:8000/auth/googleLogin", LogUser);
        if (loguser.data) {
            localStorage.setItem("userInfo", JSON.stringify(loguser.data))
            navigate("/chatpage");
        }
    }

    const responseGoogleFailure = (response) => {
        console.log("failure  ", response)
    }

    return <Container height="70vh" w={"50%"} maxW='xl' marginTop={"12"} centerContent>

        <Box height={"100%"} w={"100%"} bg='white' boxShadow={"0 1px 2px 0 rgb(48 48 48 / 30%), 0 1px 3px 1px rgb(48 48 48 / 15%);"} p={"10px"}>
            <Tabs variant='soft-rounded' colorScheme={"purple"}>
                <TabList m={"1em"}>
                    <Tab letterSpacing={"1.5px"} className='tabList' w={"50%"} ref={navigateLoginRef}>Login</Tab>
                    <Tab letterSpacing={"1.4px"} w={"50%"}>signUp</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login responseGoogleFailure={responseGoogleFailure} responseGoogleSuccess={responseGoogleSuccess} />
                    </TabPanel>
                    <TabPanel>
                        <Signup responseGoogleFailure={responseGoogleFailure} responseGoogleSuccess={responseGoogleSuccess} switchtoLogin={switchtoLogin} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
}
