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
import React, { useCallback, useEffect } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';

export default function CoveymonModal(): JSX.Element {
  const coveyTownController = useTownController();
  const newCoveymon = useInteractable('coveymonArea');

  const isOpen = newCoveymon !== undefined;

  const toast = useToast();

  // Listener function for Coveymon state updates
  const updateListener = useCallback(
    (newState: string | undefined) => {
      if (newState) {
        toast({
          title: 'Coveymon State Updated!',
          description: `New state: ${newState}`,
          status: 'info',
        });
      } else {
        toast({
          title: 'No Coveymon state available',
          status: 'warning',
        });
      }
    },
    [toast],
  );

  // Effect to handle newCoveymon setup and attach listener
  useEffect(() => {
    if (newCoveymon) {
      coveyTownController.pause();

      // Attach the updateListener to newCoveymon
      newCoveymon.addListener('stateChange', updateListener);
    } else {
      coveyTownController.unPause();
    }

    // Cleanup the listener when the component unmounts or newCoveymon changes
    return () => {
      if (newCoveymon) {
        newCoveymon.removeListener('stateChange', updateListener);
      }
    };
  }, [coveyTownController, newCoveymon, updateListener]);

  const closeModal = useCallback(() => {
    if (newCoveymon) {
      coveyTownController.interactEnd(newCoveymon);
    }
  }, [coveyTownController, newCoveymon]);

  const createCoveymonArea = useCallback(async () => {
    if (newCoveymon) {
      try {
        await coveyTownController.createCovemonArea({
          id: newCoveymon.name,
          occupantsByID: [],
        });
        toast({
          title: 'Coveymon Created!',
          status: 'success',
        });
        coveyTownController.unPause();
        closeModal();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to create Coveymon',
            description: err.toString(),
            status: 'error',
          });
        } else {
          console.trace(err);
          toast({
            title: 'Unexpected Error',
            status: 'error',
          });
        }
      }
    }
  }, [coveyTownController, newCoveymon, closeModal, toast]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Coveymon in {newCoveymon?.name} </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
            createCoveymonArea();
          }}>
          <ModalBody pb={6}></ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createCoveymonArea}>
              Create
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
