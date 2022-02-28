import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import "./Authentication.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom"
export default function Login() {
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const emailRef = useRef();
    const passwordRef = useRef();
    const toast = useToast()
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true)
        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }


        try {
            const res = await axios.post("http://localhost:8000/api/user/login", user)
            toast({
                title: 'Successfully LoggedIn.',
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false)
            localStorage.setItem("userInfo", JSON.stringify(res.data))
            res.status === 200 && navigate("/chatpage");
        } catch (err) {
            toast({
                title: 'Wrong Credentials.',
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false)
        }
    }
    const handleGoogleLogin = () => {
        window.open("http://localhost:8000/auth/google", "_self");
    }

    return <VStack spacing={"5px"} >
        <FormControl className='loginItem' >
            <FormLabel htmlFor='email'>Email </FormLabel>
            <Input id='email' type='email' ref={emailRef} />
        </FormControl>
        <FormControl className='loginItem'>
            <FormLabel htmlFor='password'>password</FormLabel>
            <InputGroup>
                <Input id='password' type={!show ? 'password' : "text"} ref={passwordRef} />
                <InputRightElement>
                    <Button h={"1.7rem"} size={"sm"} onClick={() => setShow(!show)}>
                        {show ? "hide " : "show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>


        <Box marginY={"20px"} className="loginSocialMedia">
            <Box _hover={{ bg: "gray" }} onClick={handleGoogleLogin} borderRadius="full" padding={"8px 12px"} d="flex" alignItems={"center"} className="registerLoginBox">
                <img className='registerLoginIcon' src="https://img.icons8.com/color/48/000000/google-logo.png" />
                <Text letterSpacing={"2px"} marginLeft={"8px"} fontWeight="600" fontSize="22px" className='socialMediaText'>Google</Text>
            </Box>
            {/* <Box className="registerLoginBox">
                <img className='registerLoginIcon' src="icons/twitter.png" alt="twitter" />
                <span className='socialMediaText'>Twitter</span>
            </Box>
            <Box className="registerLoginBox">
                <img className='registerLoginIcon' src="icons/github.png" alt="twitter" />
                <span className='socialMediaText'>Github</span>
            </Box> */}
        </Box>


        <Button style={{ marginTop: "30px " }} letterSpacing={"1.3px"} width={"124px"} colorScheme={"yellow"} onClick={handleLogin} isLoading={loading} >Login</Button>
    </VStack>;
}
