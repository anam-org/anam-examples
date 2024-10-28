"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageRole, Message } from "@anam-ai/js-sdk/dist/module/types";
import { useAnamContext } from "@/contexts";

/**
 * usePersonaConversation hook handles tracking the conversation messages from the Anam client.
 */
export const usePersonaConversation = (): Array<{
  sender: string;
  text: string;
}> => {
  const { setOnMessageHistoryUpdated, isClientInitialized } = useAnamContext();
  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);

  const updateConversation = useCallback((updatedMessages: Message[]) => {
    const mappedMessages = updatedMessages.map((message) => ({
      sender:
        message.role === MessageRole.PERSONA
          ? MessageRole.PERSONA
          : MessageRole.USER,
      text: message.content,
    }));
    setConversation(mappedMessages);
  }, []);

  useEffect(() => {
    if (isClientInitialized) {
      setOnMessageHistoryUpdated(updateConversation);

      return () => {
        setOnMessageHistoryUpdated(() => {});
        setConversation([]);
      };
    }
  }, [isClientInitialized, setOnMessageHistoryUpdated, updateConversation]);

  return conversation;
};
