import MessageInput from '@/components/MessageInput';
import { useState } from 'react';
import SentMessage from './SentMessage';
import { useAnam } from '@/contexts/AnamContext';
import TalkCommandMessage from '@/components/TalkCommandMessage';

export default function TalkPanel() {
  const [sentCommands, setSentCommands] = useState<string[]>([]);
  const { anamClient } = useAnam();
  const sendTalkCommand = async (content: string) => {
    return anamClient.talk(content);
  };

  const handleInputEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const message = target.value;
    target.value = '';
    await sendTalkCommand(message);
    setSentCommands([...sentCommands, message]);
  };

  return (
    <div className="w-full h-full items-start justify-end flex flex-col px-[15%]">
      <div className="h-full min-h-[150px] max-h-[800px] w-full mb-5 flex flex-col justify-end blurred-top">
        <div className="overflow-auto scrollbar-hide">
          {sentCommands.map((command, index) => (
            <TalkCommandMessage content={command} key={index} />
          ))}
        </div>
      </div>
      <MessageInput
        onEnter={handleInputEnter}
        placeholderOverride="Send a talk command..."
      />
    </div>
  );
}
