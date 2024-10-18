"use client";

import { useCallback, useEffect, useState } from "react";
import { useAnamContext } from "@/contexts";
import { useRouter } from "next/navigation";
import {
  ConversationPopup,
  ConversationTracker,
  AvatarContainer,
} from "@/components";
import { useStreamTimer, useViewportHeight } from "@/hooks";
import { LoaderCircle } from "lucide-react";

const TIME_LEFT = 120;

/**
 * DemoView component renders the main demo view with conversation tracking, timer, and streaming controls.
 */
export default function Demo(): JSX.Element {
  useViewportHeight();
  const { anamClient, setOnVideoStartedStreaming } = useAnamContext();
  const router = useRouter();
  const [isVideoStreaming, setIsVideoStreaming] = useState(false);

  const stopStreaming = useCallback((): void => {
    if (anamClient) {
      anamClient.stopStreaming().catch((error: Error) => {
        console.error("Failed to stop streaming:", error);
      });
    }
    router.push("/");
  }, [anamClient, router]);

  const [timeLeft, progressValue] = useStreamTimer(TIME_LEFT, stopStreaming);

  useEffect(() => {
    setOnVideoStartedStreaming(() => {
      setIsVideoStreaming(true);
    });
  }, [setOnVideoStartedStreaming]);

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-center items-center pt-[80px] lg:pt-0">
        <div className="flex flex-col items-center p-5 flex-1">
          <AvatarContainer
            className="
              w-full max-w-[95vw] max-h-[95vh]
              md:w-[95%] md:max-h-[90vh]
              lg:h-[90vh] lg:w-auto relative"
          >
            {/* Dynamically show loader or video based on isVideoStreaming */}
            {!isVideoStreaming && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoaderCircle className="animate-spin text-blue-500 w-12 h-12 mb-4" />
              </div>
            )}

            {isVideoStreaming && (
              <div className="absolute bottom-4 right-4 hidden md:flex">
                <ConversationPopup />
              </div>
            )}
          </AvatarContainer>
          {isVideoStreaming && (
            <div className="w-full max-w-3xl mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
            </div>
            )}
          <ConversationTracker />
        </div>
      </div>
    </div>
  );
}
