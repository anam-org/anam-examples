"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DemoSidebar, ConversationTracker } from "@/components";
import { useAnamContext, useSettingsContext } from "@/contexts";
import {
  AnamEvent,
  Message,
  MessageRole,
} from "@anam-ai/js-sdk/dist/module/types";
import { useRouter } from "next/navigation";
import { AvatarContainer } from "@/components/AvatarContainer";
import { errorHandler } from "@/utils";
import { Box } from "@radix-ui/themes";

// Initial time limit in seconds
const INITIAL_TIME_LEFT = 120;

/**
 * DemoView component renders the main demo view with conversation tracking, timer, and streaming controls.
 *
 * @component
 * @returns {JSX.Element} The rendered demo view component.
 */
export function DemoView() {
  // Retrieve the Anam client and selected language from respective contexts
  const { anamClient } = useAnamContext();
  const { selectedLanguage } = useSettingsContext();
  const router = useRouter();

  /**
   * State to track conversation messages.
   * @type {[{ sender: string, text: string }[], Function]}
   */
  const [conversation, setConversation] = useState<
    { sender: string; text: string }[]
  >([]);

  /**
   * State to track the countdown timer.
   * @type {[number, Function]}
   */
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

  /**
   * Ref to track if event listeners have been added to the client.
   * @type {React.MutableRefObject<boolean>}
   */
  const listenersAddedRef = useRef(false);

  /**
   * Stops streaming by invoking anamClient's stopStreaming method.
   *
   * @function
   * @returns {void}
   */
  const stopStreaming = useCallback(() => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error) => {
        errorHandler(`Failed to stop streaming: ${error}`, "Demo.tsx");
      });
    }
  }, [anamClient]);

  /**
   * Updates the conversation state with the latest messages received from the Anam client.
   *
   * @function
   * @param {Message[]} updatedMessages - Array of updated messages from the Anam client.
   * @returns {void}
   */
  const updateConversation = useCallback((updatedMessages: Message[]) => {
    const mappedMessages = updatedMessages.map((message) => ({
      sender:
        message.role === MessageRole.PERSONA
          ? MessageRole.PERSONA
          : MessageRole.USER,
      text: message.content,
    }));
    setConversation(mappedMessages); // Update conversation state with the new messages
  }, []);

  /**
   * Handles the end of streaming by redirecting the user to the home page.
   *
   * @function
   * @returns {void}
   */
  const handleStreamingEnd = useCallback(() => {
    router.push("/"); // Navigate to home page
  }, [router]);

  /**
   * Countdown timer effect. Decreases time left by 1 second every interval and stops streaming when time reaches zero.
   *
   * @useEffect
   */
  useEffect(() => {
    if (timeLeft === 0) {
      stopStreaming(); // Stop streaming when the timer reaches zero
    }
    const timer =
      timeLeft > 0
        ? setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        : undefined;
    return () => {
      if (timer) clearInterval(timer); // Clean up the timer on component unmount
    };
  }, [timeLeft, stopStreaming]);

  /**
   * Effect to manage adding and removing event listeners for message updates from the Anam client.
   *
   * @useEffect
   */
  useEffect(() => {
    if (anamClient && !listenersAddedRef.current) {
      // Add message history update listener to the Anam client
      anamClient.addListener(
        AnamEvent.MESSAGE_HISTORY_UPDATED,
        updateConversation,
      );
      listenersAddedRef.current = true;
    }

    return () => {
      if (anamClient && listenersAddedRef.current) {
        // Clean up listener on component unmount or when anamClient changes
        anamClient.removeListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          updateConversation,
        );
        setConversation([]); // Clear the conversation state
        listenersAddedRef.current = false;
      }
    };
  }, [anamClient, updateConversation]);

  /**
   * Progress bar value calculated based on the remaining time.
   *
   * @type {number}
   */
  const progressValue =
    ((INITIAL_TIME_LEFT - timeLeft) / INITIAL_TIME_LEFT) * 100;

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-center items-start max-w-screen-xl mx-auto">
        {/* Main Content Area */}
        <div className="flex flex-col items-center p-5 flex-1">
          <Box mt={{initial: "8", sm: "0"}} className="relative">
            {/* Avatar Container to display conversation with streaming state */}
            <AvatarContainer
              conversation={conversation}
              onStreamingEnd={handleStreamingEnd}
            />
          </Box>
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${progressValue}%` }} // Dynamic width based on time progress
              ></div>
            </div>
          </div>
          {/* Conversation Tracker: Responsive Chat for Small Screens */}
          <ConversationTracker conversation={conversation} />
        </div>
        {/* Sidebar for additional options or settings */}
        <div className="flex-none w-full md:w-auto">
          <DemoSidebar selectedLanguage={selectedLanguage} />
        </div>
      </div>
    </div>
  );
}
