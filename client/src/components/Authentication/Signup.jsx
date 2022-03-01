import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import "./Authentication.css"
import axios from "axios"
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

export default function Register() {

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState()
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const navigate = useNavigate()

  const toast = useToast()


  console.log(file)
  const handleSubmit = async () => {
    setLoading(true)
    const user = {
      name: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,

    }
    try {


      const res = await axios.post("http://localhost:8000/api/user/register", user)
      setLoading(false)

      res.status === 200 &&

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
      navigate("/login");
      localStorage.setItem("userItem", JSON.stringify(res.data));


    } catch (err) {
      console.log(err)
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
    <FormControl className='loginItem' >
      <FormLabel htmlFor='email'>Username </FormLabel>
      <Input id='email' type='text' ref={usernameRef} />
    </FormControl>

    <FormControl className='loginItem' >
      <FormLabel htmlFor='email'>Email </FormLabel>
      <Input id='email' required type='email' ref={emailRef} />
    </FormControl>

    <FormControl className='loginItem'>
      <FormLabel htmlFor='email'>password</FormLabel>
      <InputGroup>
        <Input id='email' required type={!show ? 'password' : "text"} ref={passwordRef} />
        <InputRightElement>
          <Button h={"1.7rem"} size={"sm"} onClick={() => setShow(!show)}>
            {show ? "hide " : "show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>



    <Button style={{ marginTop: "30px " }} colorScheme={"yellow"} isLoading={loading} onClick={handleSubmit} >SignUp</Button>
  </VStack>;
}
