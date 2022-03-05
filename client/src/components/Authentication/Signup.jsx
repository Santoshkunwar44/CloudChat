import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import "./Authentication.css"
import axios from "axios"
import { useToast } from '@chakra-ui/react'
import GoogleLogin from 'react-google-login';
import { Visibility, VisibilityOff } from '@material-ui/icons';

export default function Register({ switchtoLogin, responseGoogleSuccess, responseGoogleFailure }) {

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const toast = useToast()


  const handleSubmit = async () => {
    setLoading(true)
    const user = {
      name: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,

    }
    try {


      const { data } = await axios.post("http://localhost:8000/api/user/register", user)
      if (data) {
        setLoading(false)
        toast({
          title: 'Registered successfully.',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: "bottom"
        })
        usernameRef.current.value = ""
        emailRef.current.value = ""
        passwordRef.current.value = ""
        localStorage.setItem("userItem", JSON.stringify(data));
        switchtoLogin();
      }
    } catch (err) {
      console.log("error you got while registering ", err)
      setLoading(false)
      toast({
        title: 'Failed to register.',
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom"
      })
    }
  }



  return <VStack spacing={"5px"} >
    <Box marginTop={"20px"} width={"100%"} justifyContent={"space-evenly"} d={"flex"} className="loginSocialMedia">

      <Box width={"100%"} border={"2px solid #dfe6e9"} borderRadius={"3px"} padding={"5px 10px"} _hover={{ bg: "#dfe6e9" }} d="flex" alignItems={"center"}>
        <Box>

          <img style={{ width: "40px", marginRight: "12px" }} src="https://img.icons8.com/color/48/000000/google-logo.png" />
        </Box>

        <GoogleLogin
          clientId="573239136179-lmf02gf518d0ln93cj3up4vm6mrn8e4p.apps.googleusercontent.com"
          render={renderProps => (
            <button style={{ width: "100%", textAlign: "start", letterSpacing: "1.3px", margin: "0 8px", fontWeight: "600" }} onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with google </button>
          )}
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
      </Box>
    </Box>

    <Box fontSize={"2xl"} margin="5px 0" fontWeight={"500"}>
      OR
    </Box>

    <FormControl className='loginItem'  >
      <Input fontSize={"15 px"} letterSpacing="1.3px" borderRadius={"2px"} placeholder='username' id='email' type='text' ref={usernameRef} />
    </FormControl>

    <FormControl className='loginItem' >
      <Input fontSize={"15 px"} letterSpacing="1.3px" borderRadius={"2px"} id='email' placeholder='email' required type='email' ref={emailRef} />
    </FormControl>

    <FormControl className='loginItem'>
      <InputGroup>
        <Input fontSize={"15 px"} letterSpacing="1.3px" borderRadius={"2px"} id='email' placeholder='password' required type={!show ? 'password' : "text"} ref={passwordRef} />
        <InputRightElement>
          <Button h={"1.7rem"} size={"sm"} onClick={() => setShow(!show)}>
            {show ? <VisibilityOff /> : <Visibility />}
          </Button>
        </InputRightElement>

      </InputGroup>

    </FormControl>



    <Button style={{ marginTop: "30px " }} letterSpacing="1.9px " borderRadius={"2px"} colorScheme={"purple"} isLoading={loading} onClick={handleSubmit} >SignUp</Button>

  </VStack>;
}
