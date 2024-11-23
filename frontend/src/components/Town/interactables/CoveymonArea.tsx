import {
  Button,
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
import useTownController from '../../../hooks/useTownController';
import { useInteractable } from '../../../classes/TownController';

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false); // Manage modal visibility
  const onClose = useCallback(() => setIsOpen(false), []);
  const coveymon = useInteractable('coveymonArea');
  const coveyTownController = useTownController();
  const toast = useToast();

  // Listen for events to open/close the modal
  useEffect(() => {
    if (coveymon) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveymon, coveyTownController]);

  const closeModal = useCallback(() => {
    if (coveymon) {
      coveyTownController.interactEnd(coveymon);
    }
  }, [coveyTownController, coveymon]);

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hello!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>This is a simple popup message saying Hello!</p>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={openToast}>
            Show Toast
          </Button>
          <Button onClick={closeModal}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
