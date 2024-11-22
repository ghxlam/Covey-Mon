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
import React, { useCallback, useEffect } from 'react';
import { useInteractable } from '../../../classes/TownController';
import { ConversationArea } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';

export default function NewConveymonModal(): JSX.Element {
  const coveyTownController = useTownController();
  const newCoveymon = useInteractable('coveymonArea');

  const isOpen = newCoveymon !== undefined;

  useEffect(() => {
    if (newCoveymon) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newCoveymon]);

  const closeModal = useCallback(() => {
    if (newCoveymon) {
      coveyTownController.interactEnd(newCoveymon);
    }
  }, [coveyTownController, newCoveymon]);

  const toast = useToast();

  const createCoveymonArea = useCallback(async () => {
    if (newCoveymon) {
      const conversationToCreate: ConversationArea = {
        id: newCoveymon.name,
        occupantsByID: [],
      };
      try {
        await coveyTownController.createConversationArea(conversationToCreate);
        toast({
          title: 'Coveymon Created!',
          status: 'success',
        });
        coveyTownController.unPause();
        closeModal();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to create coveymon',
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
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='topic'>Topic of Conversation</FormLabel>
              <Input
                id='topic'
                placeholder='Share the topic of your conversation'
                name='topic'
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createConversation}>
              Create
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
