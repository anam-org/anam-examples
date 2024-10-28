"use client";

import { useCallback, useState, useEffect } from "react";
import { useAudioPermissionContext } from "@/contexts";
import {
  ConversationPopup,
  ConversationTracker,
  AvatarContainer,
} from "@/components";
import { useViewportHeight } from "@/hooks";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnamContext } from "@/contexts/AnamContext";

const TIME_LEFT = 120;

/**
 * DemoView component renders the main demo view with conversation tracking, timer, and streaming controls.
 */
export default function Demo(): JSX.Element {
  useViewportHeight();
  const { audioStream } = useAudioPermissionContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
  const [progress, setProgress] = useState(0);

  const { setOnVideoStartedStreaming } = useAnamContext();

  // Stop streaming and navigate to the home page
  const handleStopStreaming = useCallback((): void => {
    router.push("/");
    setIsLoading(true);
  }, [router]);

  // Update progress bar and time left
  useEffect(() => {
    if (timeLeft <= 0) {
      handleStopStreaming();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
      setProgress(((TIME_LEFT - timeLeft) / TIME_LEFT) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, handleStopStreaming]);

  useEffect(() => {
    setOnVideoStartedStreaming(() => {
      setIsLoading(false);
    });
  }, [setOnVideoStartedStreaming]);

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-center items-center pt-[80px] lg:pt-0">
        <div className="flex flex-col items-center p-5 flex-1">
          <AvatarContainer
            className="
              w-full max-w-[95vw] max-h-[95vh]
              md:w-[95%] md:max-h-[95vh]
              lg:h-[95vh] lg:w-auto relative"
            videoClassName="w-full h-full object-contain"
            audioStream={audioStream || undefined}
          >
            {/* Dynamically show loader or video based on isLoading */}
            {isLoading && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoaderCircle className="animate-spin text-blue-500 w-12 h-12 mb-4" />
              </div>
            )}

            {!isLoading && (
              <>
                <div className="absolute bottom-4 right-4 hidden md:flex">
                  <ConversationPopup />
                </div>
                <div className="absolute w-full max-w-3xl -bottom-3 left-1/2 transform -translate-x-1/2 mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${progress}%`, maxWidth: "100%" }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </AvatarContainer>
          <ConversationTracker />
        </div>
      </div>
    </div>
  );
}
