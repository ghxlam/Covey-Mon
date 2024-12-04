import { ConversationArea, Interactable, ViewingArea, CoveymonArea } from './CoveyTownSocket';

/**
 * Test to see if an interactable is a conversation area
 */
export function isConversationArea(interactable: Interactable): interactable is ConversationArea {
  return 'occupantsByID' in interactable;
}

/**
 * Test to see if an interactable is a viewing area
 */
export function isViewingArea(interactable: Interactable): interactable is ViewingArea {
  return 'isPlaying' in interactable;
}

export function isCoveymon(interactable: Interactable): interactable is CoveymonArea {
  return 'players' in interactable;
}
