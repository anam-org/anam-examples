import { useState, useEffect, useRef } from "react";
import { MessageRole } from "@anam-ai/js-sdk/dist/module/types";
import { IconButton, Flex, Box, Popover, Text } from "@radix-ui/themes";
import { MessageCircle, X } from "lucide-react";

interface ConversationPopupProps {
  conversation: { sender: string; text: string }[];
}

/**
 * ConversationPopup component displays a chat interface in a popover with a button to toggle the visibility.
 * It scrolls the chat content to the bottom automatically when opened or new messages arrive.
 *
 * @component
 * @param {ConversationPopupProps} props - The props for the component, including the conversation array.
 * @returns {JSX.Element} The ConversationPopup component.
 */
export const ConversationPopup = ({ conversation }: ConversationPopupProps) => {
  /**
   * State to track whether the popover is open.
   * @type {[boolean, Function]}
   */
  const [open, setOpen] = useState(false);

  /**
   * Ref to the end of the messages list to automatically scroll to the bottom.
   * @type {React.MutableRefObject<HTMLDivElement | null>}
   */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * Scrolls the chat content to the bottom of the list.
   *
   * @function
   * @returns {void}
   */
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  /**
   * Effect that triggers when the popover opens or when new messages arrive.
   * It ensures that the chat scrolls to the bottom.
   *
   * @useEffect
   */
  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [open, conversation]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
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
          <Text className="dark:text-black">Chat</Text>
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
                  <Text wrap="pretty" size="1">
                    {message.text}
                  </Text>
                </Box>
              </Flex>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
};
