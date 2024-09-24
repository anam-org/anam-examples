export default function TalkCommandMessage({ content }: { content: string }) {
  return (
    <div className="flex items-end mb-2">
      <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-1 items-start">
        <div>
          <span className="px-4 py-2 rounded-2xl inline-block rounded-br-none bg-yellow-400 text-white">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
