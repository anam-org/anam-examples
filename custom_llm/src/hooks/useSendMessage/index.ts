import { useReducer } from 'react';
import { Author, MessageActionType, SendMessageState } from './types';
import sentMessagesReducer, { initialState } from './reducer';
import { MessageStreamEvent } from '@anam-ai/js-sdk/dist/module/types';

const useSendMessage = (): {
  onSendMessage: (message: string) => void;
  onReceiveMessageStreamEvent: (message: MessageStreamEvent) => void;
  state: SendMessageState;
} => {
  const [state, dispatch] = useReducer(sentMessagesReducer, initialState);

  const onSendMessage = (message: string) => {
    dispatch({
      type: MessageActionType.ADD_USER_MESSAGE,
      payload: { author: Author.USER, content: message },
    });
  };

  const onReceiveMessageStreamEvent = (message: MessageStreamEvent) => {
    if (message.role === 'persona') {
      dispatch({
        type: MessageActionType.PROCESS_RECEIVED_MESSAGE,
        payload: message,
      });
    } else if (message.role === 'user') {
      onSendMessage(message.content);
    } else {
      console.log('Unknown message type: ' + message.role);
      console.log(message);
    }
  };

  return {
    onSendMessage,
    onReceiveMessageStreamEvent,
    state,
  };
};

export default useSendMessage;
