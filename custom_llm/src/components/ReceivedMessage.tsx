export default function ReceivedMessage({ content }: { content: string }) {
  return (
    <div className="flex items-end mb-2">
      <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 items-start">
        <div>
          <span className="px-4 py-2 rounded-2xl inline-block rounded-bl-none bg-gray-100 text-gray-600">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
