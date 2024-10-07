'use client';
import AvatarPlayer from '@/components/AvatarPlayer';
import Panel from '@/components/Panel';
import { useEffect, useRef, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { AiOutlineClose } from 'react-icons/ai';
import useSendMessage from '@/hooks/useSendMessage/index';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/AlertModal';
import ConversationPanel from '@/components/ConversationPanel';
import { useAnam } from '@/contexts/AnamContext';
import TalkPanel from '@/components/TalkPanel';
import { AnamEvent } from '@anam-ai/js-sdk/dist/module/types';

export default function Session() {
  const router = useRouter();
  const { anamClient } = useAnam();

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(
    'Connecting you to an Anam.ai persona...',
  );

  const isStreaming = useRef(false);

  const [showMessageHistory, setShowMessageHistory] = useState(
    process.env.NEXT_PUBLIC_VIEW_MESSAGE_HISTORY_IN_UI === 'true',
  );
  // use to display error modals to the user.
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<{
    header: string;
    body: string;
  }>({ header: '', body: '' });

  const onConnectionEstablished = () => {
    setLoadingText('Connected to a Persona. Starting video stream...');
  };

  const onVideoStartedStreaming = () => {
    setLoading(false);
  };

  const goHome = () => {
    router.push('/');
  };

  const onConnectionClosed = (reason: string) => {
    setModalMessage({ header: 'Conversation Closed', body: reason });
    setShowModal(true);
  };

  const {
    onSendMessage,
    onReceiveMessageStreamEvent,
    state: messageState,
  } = useSendMessage();

  const [stopped, setStopped] = useState(false);

  const onClickStop = () => {
    setStopped(true);
    anamClient.stopStreaming();
    isStreaming.current = false;
    goHome();
  };

  useEffect(() => {
    const startStream = async () => {
      anamClient.addListener(
        AnamEvent.CONNECTION_ESTABLISHED,
        onConnectionEstablished,
      );
      anamClient.addListener(AnamEvent.CONNECTION_CLOSED, onConnectionClosed);
      anamClient.addListener(
        AnamEvent.VIDEO_PLAY_STARTED,
        onVideoStartedStreaming,
      );
      anamClient.addListener(
        AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED,
        onReceiveMessageStreamEvent,
      );
      try {
        await anamClient.streamToVideoAndAudioElements('video', 'audio');
      } catch (error: any) {
        if (error instanceof Error) {
          setModalMessage({
            header: 'Persona Busy',
            body: 'All our personas are currently busy. Please try again later.',
          });
          setShowModal(true);
        } else {
          console.error(error);
        }
      }
    };

    if (!stopped && !isStreaming.current && !anamClient.isStreaming()) {
      isStreaming.current = true;
      startStream();
    }

    // clean up connection on exit
    return () => {
      anamClient.stopStreaming();
    };
  }, []);

  return (
    <>
      {showMessageHistory && (
        <div className="w-full minH-full flex justify-end">
          <TalkPanel />
        </div>
      )}
      <Panel>
        <div className="w-full h-full flex flex-col">
          <div className="hidden md:block absolute top-10 right-10">
            <button
              id="stop"
              onClick={onClickStop}
              className="flex items-center justify-center p-2 border-2 rounded-xl border-gray-600 w-[50px] h-[50px] shadow-md"
            >
              <AiOutlineClose size="2rem" color="#4b5563" />
            </button>
          </div>
          <>
            <div className="flex-grow flex w-full items-center justify-center">
              <div
                style={{ display: loading ? 'none' : 'block' }}
                onDoubleClick={(e) =>
                  setShowMessageHistory(!showMessageHistory)
                }
              >
                <AvatarPlayer />
              </div>
              <div
                style={{
                  display: loading ? 'flex' : 'none',
                  flexFlow: 'column',
                }}
              >
                <Spinner
                  aria-label="Extra large spinner example"
                  size="xl"
                  style={{ zoom: 2.0, margin: 'auto' }}
                />
                <label className="text-xl my-12">{loadingText}</label>
              </div>
            </div>
            <div className="w-full p-8 flex justify-center">
              <Button
                onClick={() => setShowMessageHistory(!showMessageHistory)}
                color="blue"
                size="lg"
              >
                {showMessageHistory ? 'Hide Chat' : 'Show Chat'}
              </Button>
            </div>
            <AlertModal
              show={showModal}
              header={modalMessage.header}
              body={modalMessage.body}
              onClose={() => onClickStop()}
            />
          </>
        </div>
      </Panel>
      {showMessageHistory && (
        <div className="w-full minH-full flex justify-end">
          <ConversationPanel
            sendData={(message: string) => anamClient.sendDataMessage(message)}
            sentMessages={messageState.sentMessages}
            onSendMessage={onSendMessage}
            showTypingIndicator={messageState.showTypingIndicator}
          />
        </div>
      )}
    </>
  );
}
