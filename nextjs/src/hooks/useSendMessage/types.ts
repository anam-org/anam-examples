import { MessageStreamEvent } from '@anam-ai/js-sdk/dist/module/types';

export enum Author {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system',
}

export type Message = { author: Author; content: string; id?: string };

export enum MessageActionType {
  ADD_USER_MESSAGE = 'ADD_USER_MESSAGE',
  PROCESS_RECEIVED_MESSAGE = 'PROCESS_RECEIVED_MESSAGE',
}

export type MessageAction =
  | { type: MessageActionType.ADD_USER_MESSAGE; payload: Message }
  | {
      type: MessageActionType.PROCESS_RECEIVED_MESSAGE;
      payload: MessageStreamEvent;
    };

export type SendMessageState = {
  showTypingIndicator: boolean;
  sentMessages: Message[];
};
