"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DemoSidebar, ConversationTracker } from "@/components";
import { useAnamContext, useSettingsContext } from "@/contexts";
import { AnamEvent, Message, MessageRole } from "@anam-ai/js-sdk/dist/module/types";
import { useRouter } from "next/navigation";
import { AvatarContainer } from "@/components/AvatarContainer";

const INITIAL_TIME_LEFT = 120;

export function DemoView() {
  const { anamClient } = useAnamContext();
  const { selectedLanguage } = useSettingsContext();
  const router = useRouter();

  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

  const listenersAddedRef = useRef(false);

  const stopStreaming = useCallback(() => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error) => {
        console.error("Failed to stop streaming:", error);
      });
    }
  }, [anamClient]);

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

  const handleStreamingEnd = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (timeLeft === 0) {
      stopStreaming();
    }
    const timer =
      timeLeft > 0 ? setInterval(() => setTimeLeft((prev) => prev - 1), 1000) : undefined;
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, stopStreaming]);

  useEffect(() => {
    if (anamClient && !listenersAddedRef.current) {
      anamClient.addListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        updateConversation
      );
      listenersAddedRef.current = true;
    }

    return () => {
      if (anamClient && listenersAddedRef.current) {
        anamClient.removeListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          updateConversation
        );
        setConversation([]);
        listenersAddedRef.current = false;
      }
    };
  }, [anamClient, updateConversation]);

  const progressValue =
    ((INITIAL_TIME_LEFT - timeLeft) / INITIAL_TIME_LEFT) * 100;

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-center items-start max-w-screen-xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col items-center p-5 flex-1">
          <div className="relative">
            <AvatarContainer
              conversation={conversation}
              onStreamingEnd={handleStreamingEnd}
            />
          </div>
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
          {/* Responsive Chat for Small Screens */}
          <ConversationTracker conversation={conversation} />
        </div>
        {/* Sidebar */}
        <div className="flex-none w-full md:w-auto">
          <DemoSidebar selectedLanguage={selectedLanguage} />
        </div>
      </div>
    </div>
  );
}
