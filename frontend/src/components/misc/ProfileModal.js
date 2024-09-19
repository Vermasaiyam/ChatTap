import { ViewIcon } from '@chakra-ui/icons';
import { Button, Center, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}

            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>

                <ModalOverlay />
                <ModalContent h="410px">
                    <Center>

                        <ModalHeader
                            fontSize="40px"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent="center"
                        >
                            {user.name}
                        </ModalHeader>
                    </Center>
                    <ModalCloseButton />

                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Center>

                            <Image
                                borderRadius="full"
                                boxSize="150px"
                                src={user.pic}
                                alt={user.name}
                            />
                        </Center>
                        <Center>

                            <Text
                                fontSize={{ base: "28px", md: "30px" }}
                                fontFamily="Work sans"
                            >
                                Email: {user.email}
                            </Text>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileModal
