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

export function JoinModal({ onJoin }: { onJoin: () => void }) {
  return (
    <>
      <Modal Header>Hello!</ModalHeader>
      <ModalBody>
        <p>This is a simple popup message saying Hello!</p>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onJoin}>
          Join
        </Button>
      </ModalFooter>
    </>
  );
}

export default function CoveymonAreaModal(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false); // Manage modal visibility
  const coveymon = useInteractable('coveymonArea');
  const coveyTownController = useTownController();
  const toast = useToast();

  const openModal = useCallback(() => {
    setIsOpen(true);
    coveyTownController.pause(); // Pause the game when modal is opened
  }, [coveyTownController]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (coveymon) {
      coveyTownController.interactEnd(coveymon); // End the interaction
    }
    coveyTownController.unPause(); // Unpause the game when modal is closed
  }, [coveymon, coveyTownController]);

  // Detect if we are interacting with a Coveymon area and open the modal
  useEffect(() => {
    if (coveymon) {
      openModal();
    }
  }, [coveymon, openModal]);

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
    <Modal isOpen={isOpen} onClose={closeModal}>
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
