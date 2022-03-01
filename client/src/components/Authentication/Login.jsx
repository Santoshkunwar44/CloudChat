import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import "./Authentication.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from 'react-google-login';
import { GitHub } from "@material-ui/icons"
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





    const responseGoogleSuccess = async (response) => {

        let LogUser = {
            tokenId: response.tokenId,
        }
        const loguser = await axios.post("http://localhost:8000/auth/googleLogin", LogUser);
        console.log("success ", loguser)
        if (loguser.data) {
            localStorage.setItem("userInfo", JSON.stringify(loguser.data))
            navigate("/chatpage");
        }
    }




    const responseGoogleFailure = (response) => {
        console.log("failure  ", response)
    }

    const handleGithubLogin = () => {
        window.open("http://localhost:8000/auth/github", "_self");
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


        <Box marginY={"40px"} width={"100%"} justifyContent={"space-evenly"} d={"flex"} className="loginSocialMedia">

            {/* <Box className="registerLoginBox">
                <img className='registerLoginIcon' src="icons/twitter.png" alt="twitter" />
                <span className='socialMediaText'>Twitter</span>
            </Box> */}


            <Box  borderRadius={"3px"}  padding={"5px 10px"} border={"2px solid #9c88ff"} _hover={{ bg: "gray" }} cursor={"pointer"} d={"flex"} alignItems={"center"} onClick={handleGithubLogin} className="registerLoginBox">
                <GitHub style={{ fontSize: "35px", marginRight: "12px" }} />
                <span className='socialMediaText'>Login with Github</span>
            </Box>



            <Box border={"2px solid #9c88ff"} borderRadius={"3px"} padding={"5px 10px"} _hover={{ bg: "gray" }} d="flex" alignItems={"center"}>
                <Box>

                    <img style={{ width: "40px", marginRight: "12px" }} src="https://img.icons8.com/color/48/000000/google-logo.png" />
                </Box>

                <GoogleLogin
                    clientId="573239136179-lmf02gf518d0ln93cj3up4vm6mrn8e4p.apps.googleusercontent.com"
                    render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with google </button>
                    )}
                    onSuccess={responseGoogleSuccess}
                    onFailure={responseGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </Box>
        </Box>
        <Button style={{ marginTop: "30px" }} letterSpacing={"1.3px"} width={"124px"} colorScheme={"yellow"} onClick={handleLogin} isLoading={loading} >Login</Button>
    </VStack>;
}
