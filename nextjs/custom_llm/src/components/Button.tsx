export default function Button({
  text,
  id,
  onClick, disabled = false,
}: {

  text: string;
  id: string;
  onClick: () => void;
  disabled?: boolean;
}) {

  return (
    <div className={`w-full md:w-[420px] rounded-lg p-[2px] border border-gray-500 shadow-md`}>
      <button
        id={id}
        onClick={onClick}
        disabled={disabled}
        className={`w-full h-full rounded-md py-2 px-6 md:py-4 md:px-12 text-2xl md:text-3xl font-light bg-gray-100 text-text`}
      >
        {text}
      </button>
    </div>
  );
}
