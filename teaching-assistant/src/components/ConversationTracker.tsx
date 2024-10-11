import { useRef, useEffect, useState } from "react";
import { MessageRole } from "@anam-ai/js-sdk/dist/module/types";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ResponsiveConversationProps {
  conversation: { sender: string; text: string }[];
}

/**
 * ConversationTracker component handles displaying the conversation history in a toggleable section
 * on mobile screens (small screens). It can expand or collapse the conversation and scroll to the bottom
 * when new messages arrive.
 *
 * @component
 * @param {ResponsiveConversationProps} props - The props for the component, including the conversation array.
 * @returns {JSX.Element} The ConversationTracker component.
 */
export const ConversationTracker = ({
  conversation,
}: ResponsiveConversationProps) => {
  /** 
   * Ref to the end of the conversation list to automatically scroll to the bottom.
   * @type {React.MutableRefObject<HTMLDivElement | null>}
   */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /** 
   * State to track if the conversation history is open.
   * @type {[boolean, Function]}
   */
  const [open, setOpen] = useState(false);

  /**
   * Scrolls the conversation content to the bottom of the list.
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
   * Effect that triggers when the conversation updates or when the history is opened.
   * It ensures the chat scrolls to the bottom when new messages are added or the history is opened.
   *
   * @useEffect
   */
  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [conversation, open]);

  return (
    <div className="block md:hidden w-full pt-2">
      <div>
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <span className="text-lg font-semibold">Conversation History</span>
          {open ? (
            <ArrowUp className="ml-2" size={20} />
          ) : (
            <ArrowDown className="ml-2" size={20} />
          )}
        </button>
        {/* Conversation Content */}
        {open && (
          <div className="mt-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
            <div className="w-full max-h-[40vh] overflow-y-auto p-4">
              {conversation.map((message, index) => {
                const isPersona = message.sender === MessageRole.PERSONA;
                return (
                  <div
                    key={index}
                    className={`flex my-2 ${
                      isPersona ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`p-3 max-w-[80%] break-words ${
                        isPersona
                          ? "bg-blue-600 text-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
                          : "bg-indigo-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
                      } shadow-md`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
