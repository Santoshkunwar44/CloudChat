import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Input,
    Box,
    Spinner,
    useDisclosure,
    Image,
} from '@chakra-ui/react'
import { AvatarImg } from "../../AvatarImg"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import axios from 'axios';
import { app } from '../../config/firebase';
import { ChatState } from '../../context/Chatprovider';



export default function ProfileBoxModal({ children, fetchAgain, setFetchAgain }) {
    const [file, setFile] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [avatar, setAvatar] = useState(null)
    const { user, setUser } = ChatState();
    const [loadingProfilePic, setloadingProfilePic] = useState(false)
    let updatedUser;

    useEffect(() => {
        user && !user?.notfirstTimeLogged && onOpen();
    }, [user])


    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem("userInfo")))
    }, [fetchAgain])
    const handleProfilePicture = async () => {

        setloadingProfilePic(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        }
        if (avatar) {
            setloadingProfilePic(true)
            updatedUser = {
                pic: avatar
            }
            if (avatar) {
                const { data } = await axios.put(`http://localhost:8000/api/user/${user?._id}`, updatedUser, config)
                console.log(data)
                if (data) {
                    let newUser = { ...user }
                    newUser.pic = avatar;
                    newUser.notfirstTimeLogged = true;
                    localStorage.setItem("userInfo", JSON.stringify(newUser))
                    setloadingProfilePic(false)
                    setFetchAgain(!fetchAgain)
                    onClose()
                }

            }
        }

        if (file) {
            const fileName = new Date().getTime() + file.name;
            const storage = getStorage(app)
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)



            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {


                        updatedUser = {
                            pic: downloadURL,
                        }
                        const { data } = await axios.put(`http://localhost:8000/api/user/${user?._id}`, updatedUser, config)

                        if (data) {
                            let newUser = { ...user }
                            newUser.pic = downloadURL;
                            newUser.notfirstTimeLogged = true;
                            localStorage.setItem("userInfo", JSON.stringify(newUser))
                            setFetchAgain(!fetchAgain)
                            setloadingProfilePic(false)

                            onClose()
                        }
                    });
                }
            );

        }
    }

    function setPic() {
        if (file) {
            console.log("insite the file")
            return URL.createObjectURL(file);
        } else if (avatar) {
            console.log("inside the avatar")
            return avatar;
        } else {
            console.log("default")
            return user?.pic;
        }

    }

    const handleClose = () => {
        if (!user?.notfirstTimeLogged) {
            let newUser = { ...user }
            newUser.notfirstTimeLogged = true;
            localStorage.setItem("userInfo", JSON.stringify(newUser))
            setloadingProfilePic(false)
        }
        onClose()
    }



    return (
        <>
            <span onClick={onOpen}> {children}</span>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color={"purple.500"} fontSize={"25px"} d={"flex"} justifyContent={"center"}>Change ProfiePicture</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d={"flex"} alignItems={"center"} flexDir={"column"} >
                        <Box d={"flex"} justifyContent={"space-between"} flexDir="column" alignItems={"center"}>
                            <Image src={setPic()} width={"150px"} margin="15px" height={"150px"} borderRadius={"full"} objectFit={"cover"} />
                            <label className='profileChangeBtn' htmlFor="myfile" >
                                Change Picture
                            </label>
                            <input style={{ display: "none" }} type="file" onChange={(e) => { setAvatar(null); setFile(e.target.files[0]) }} id="myfile" />
                        </Box>
                        <Box fontWeight={"700"} letterSpacing={"1.7px"} fontSize={"1.4em"} margin={"10px 0"}> OR </Box>
                        <Box textAlign={"center"} >
                            <Box letterSpacing={"1.3px"} color={"gray.500"} margin={"4px 0 "} fontWeight={600} fontSize="1.1em" className='defaultAvatars'> Use default avatars</Box>
                            <Box d={"flex"} width="100%" >
                                {
                                    AvatarImg.map((e) => (

                                        <Image onClick={() => { setFile(null); setAvatar(e.img) }} key={e.id} className='avatarItem' src={e?.img} width={"55px"} margin=" 0 8px " height={"55px"} borderRadius={"full"} objectFit={"cover"} />
                                    ))
                                }


                            </Box>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button isLoading={loadingProfilePic} onClick={handleProfilePicture} borderRadius="2px" letterSpacing="1.8px" fontWeight={"500"} colorScheme='purple' >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
