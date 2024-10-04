import { MessageRole } from "@anam-ai/js-sdk/dist/module/types";
import { IconButton, Flex, Box, Popover, Text } from "@radix-ui/themes";
import { MessageCircle, X } from "lucide-react";

interface ConversationPopupProps {
  conversation: { sender: string; text: string }[];
}

export const ConversationPopup = ({ conversation }: ConversationPopupProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton variant="solid" className="p-2 rounded-full mx-1">
          <MessageCircle size={24} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        className="bg-white shadow-lg z-50 h-80 w-72 rounded-lg"
        side="left"
        align="end"
        alignOffset={100}
      >
        {/* Chat Header */}
        <Flex justify="between" className="p-1 border-b">
          <Text>Chat</Text>
          <Popover.Close>
            <IconButton variant="ghost">
              <X size={18} />
            </IconButton>
          </Popover.Close>
        </Flex>

        {/* Chat Content */}
        <Box className="overflow-y-auto h-[calc(100%_-_30px)] p-2 space-y-3">
          {conversation.map((message, index) => {
            const isPersona = message.sender === MessageRole.PERSONA;
            return (
              <Flex
                key={index}
                justify={isPersona ? "start" : "end"}
                className={isPersona ? "mr-auto" : "ml-auto"}
              >
                <Box
                  className={`p-2 max-w-[80%] ${
                    isPersona
                      ? "bg-gray-300 text-black rounded-t-lg rounded-br-lg"
                      : "bg-blue-500 text-white rounded-t-lg rounded-bl-lg"
                  } shadow-md`}
                >
                  <Text size="1">{message.text}</Text>
                </Box>
              </Flex>
            );
          })}
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
};
