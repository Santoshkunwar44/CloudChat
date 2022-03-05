import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import "./Authentication.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from 'react-google-login';
import { Visibility, VisibilityOff } from '@material-ui/icons';
export default function Login({ responseGoogleFailure, responseGoogleSuccess }) {
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


    // const handleGithubLogin = () => {
    //     window.open("http://localhost:8000/auth/github", "_self");
    //     localStorage.setItem("mediaLogged", JSON.stringify(true))
    // }
    return <VStack width={"100%"} spacing={"5px"}   >

        <Box width={"100%"} marginTop={"20px"} width={"100%"} justifyContent={"space-evenly"} d={"flex"} className="loginSocialMedia">
            {/* <Box borderRadius={"3px"} padding={"5px 10px"} border={"2px solid #dfe6e9"} _hover={{ bg: "#dfe6e9" }} cursor={"pointer"} d={"flex"} alignItems={"center"} onClick={handleGithubLogin} className="registerLoginBox" >
                <GitHub style={{ fontSize: "35px", marginRight: "12px" }} />
                <span className='socialMediaText'>Login with Github</span>
            </Box> */}
            <Box width={"100%"} border={"2px solid #dfe6e9"} borderRadius={"3px"} padding={"5px 10px"} _hover={{ bg: "#dfe6e9" }} d="flex" alignItems={"center"}>
                <Box>

                    <img style={{ width: "40px", marginRight: "12px" }} src="https://img.icons8.com/color/48/000000/google-logo.png" />
                </Box>

                <GoogleLogin
                    clientId="573239136179-lmf02gf518d0ln93cj3up4vm6mrn8e4p.apps.googleusercontent.com"
                    render={renderProps => (
                        <button style={{ width: "100%", textAlign: "start", letterSpacing: "1.5px", margin: "0 8px ", fontWeight: "600" }} onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with google </button>
                    )}
                    onSuccess={responseGoogleSuccess}
                    onFailure={responseGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </Box>
        </Box>
        <Box marginY={"5px"} fontSize={"2xl"}>
            OR
        </Box>
        <FormControl className='loginItem' margin={"10px 0 "} >
            <Input marginY={"4px"} borderRadius={"2px"} fontSize="15px" letterSpacing={"1.4px"} placeholder="Email" id='email' type='email' ref={emailRef} />
        </FormControl>
        <FormControl className='loginItem'>
            <InputGroup>
                <Input marginY={"4px"} borderRadius={"2px"} fontSize="15px" placeholder="password" letterSpacing={"1.8px"} id='password' type={!show ? 'password' : "text"} ref={passwordRef} />
                <InputRightElement>
                    <Button h={"1.7rem"} size={"sm"} onClick=
                        {() => setShow(!show)}>
                        {show ? <VisibilityOff /> : <Visibility />}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button style={{ marginTop: "30px" }} letterSpacing={"1.8px"} width={"100px"} colorScheme={"purple"} borderRadius="2px" onClick={handleLogin} isLoading={loading} >Login</Button>

    </VStack>;
}
