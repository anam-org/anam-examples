interface Props {
  placeholderOverride?: string;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function MessageInput({ onEnter, placeholderOverride }: Props) {
  return (
    <div
      className={`w-full bg-none flex items-center rounded-lg px-2 py-1 drop-shadow-2xl `}
    >
      <input
        type="text"
        id="message-input"
        placeholder={placeholderOverride || 'Ask me something...'}
        className={`placeholder:italic placeholder:text-slate-400 bg-inherit block w-full text-white p-4 text-lg focus:outline-none border-white focus:border-white focus:ring-0`}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            onEnter(e);
          }
        }}
      />
    </div>
  );
}
