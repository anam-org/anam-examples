import {
  Author,
  MessageAction,
  MessageActionType,
  SendMessageState,
} from './types';

export const initialState: SendMessageState = {
  showTypingIndicator: false,
  sentMessages: [],
};

const sentMessagesReducer = (
  state: SendMessageState,
  action: MessageAction,
): SendMessageState => {
  switch (action.type) {
    case MessageActionType.ADD_USER_MESSAGE:
      return {
        showTypingIndicator: true,
        sentMessages: [
          ...state.sentMessages,
          {
            author: action.payload.author,
            content: action.payload.content,
            id: action.payload.id,
          },
        ],
      };
    case MessageActionType.PROCESS_RECEIVED_MESSAGE:
      const existingMessage = state.sentMessages.find(
        (m) => m.id === action.payload.id,
      );
      if (existingMessage) {
        return {
          showTypingIndicator: false,
          sentMessages: state.sentMessages.map((msg) =>
            msg.id === action.payload.id
              ? { ...msg, content: msg.content + action.payload.content }
              : msg,
          ),
        };
      } else {
        return {
          showTypingIndicator: false,
          sentMessages: [
            ...state.sentMessages,
            {
              author: Author.BOT,
              content: action.payload.content,
              id: action.payload.id,
            },
          ],
        };
      }
    default:
      return state;
  }
};

export default sentMessagesReducer;
