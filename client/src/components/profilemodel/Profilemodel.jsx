import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';


export default function Profilemodel({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return <>
        {
            children ? <span onClick={onOpen} >{children}</span> : <i class="far fa-user-circle"></i>
        }
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent d="flex" alignItems={"center"} flexDirection={"column"} height={"400px"}>
                    <ModalHeader fontSize={"33px"}>{user.userName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image objectFit={"cover"} src={user.pic} borderRadius={"full"} name={user.userName} width={"200px"} height={"200px"} />
                        <Text fontSize={"24px"}> {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="purple" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    </>;
}
