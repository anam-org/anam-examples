import MessageInput from '@/components/MessageInput';
import { Author, Message } from '@/hooks/useSendMessage/types';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import ReceivedTyping from './ReceivedTyping';

export default function ConversationPanel({
  sendData,
  sentMessages,
  onSendMessage,
  showTypingIndicator,
}: {
  sendData: (message: string) => void;
  sentMessages: Message[];
  onSendMessage: (message: string) => void;
  showTypingIndicator: boolean;
}) {
  const sendMessage = async (message: string) => {
    const currentTimestamp = new Date().toISOString().replace('Z', ''); // Remove trailing 'Z';
    const body = JSON.stringify({
      content: message,
      timestamp: currentTimestamp,
      session_id: sessionStorage.getItem('session_id'),
      message_type: 'message',
    });
    // send data to the server
    sendData(body);
    // update local state
    onSendMessage(message);
  };

  const handleInputEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const message = target.value;
    target.value = '';
    await sendMessage(message);
  };

  return (
    <div className="w-full h-full items-start justify-end flex flex-col px-[15%]">
      <div className="h-full min-h-[150px] max-h-[800px] w-full mb-5 flex flex-col justify-end blurred-top">
        <div className="overflow-auto scrollbar-hide">
          {sentMessages.map(
            (message, index) =>
              message.content &&
              (message.author === Author.USER ? (
                <SentMessage content={message.content} key={index} />
              ) : (
                <ReceivedMessage content={message.content} key={index} />
              )),
          )}
          {showTypingIndicator && <ReceivedTyping />}
        </div>
      </div>
      <MessageInput onEnter={handleInputEnter} />
    </div>
  );
}
