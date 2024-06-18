import { useReducer } from 'react';
import {
  Author,
  MessageActionType,
  SendMessageState,
  TextResponseMessageEvent,
} from './types';
import sentMessagesReducer, { initialState } from './reducer';

const useSendMessage = (): {
  onSendMessage: (message: string) => void;
  onReceiveMessage: (message: TextResponseMessageEvent) => void;
  state: SendMessageState;
} => {
  const [state, dispatch] = useReducer(sentMessagesReducer, initialState);

  const onSendMessage = (message: string) => {
    dispatch({
      type: MessageActionType.ADD_USER_MESSAGE,
      payload: { author: Author.USER, content: message },
    });
  };

  const onReceiveMessage = (message: TextResponseMessageEvent) => {
    if (message.message_type === 'persona') {
      dispatch({
        type: MessageActionType.PROCESS_RECEIVED_MESSAGE,
        payload: message,
      });
    } else if (message.message_type === 'user') {
      onSendMessage(message.content);
    } else {
      console.log('Unknown message type: ' + message.message_type);
      console.log(message);
    }
  };

  return {
    onSendMessage,
    onReceiveMessage,
    state,
  };
};

export default useSendMessage;
