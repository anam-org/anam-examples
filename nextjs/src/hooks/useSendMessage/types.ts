export interface TextResponseMessageEvent {
  message_id: string;
  content_index: number;
  content: string;
  message_type: string;
  end_of_speech: boolean;
}

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
      payload: TextResponseMessageEvent;
    };

export type SendMessageState = {
  showTypingIndicator: boolean;
  sentMessages: Message[];
};
