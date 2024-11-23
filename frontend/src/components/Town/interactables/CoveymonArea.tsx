import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import { CoveymonArea } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const toast = useToast();

  const openToast = () => {
    toast({
      title: 'Hello!',
      description: 'This is a simple popup message.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Open Hello Modal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hello!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>This is a simple popup message saying Hello!</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={openToast}>
              Show Toast
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}