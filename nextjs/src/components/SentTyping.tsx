export default function SentTyping() {
  return (
    <div className="flex items-end justify-end mb-2">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div>
          <span className="px-4 py-2 rounded-2xl inline-block rounded-br-none bg-blue-600 text-white">
            <div className="flex items-center h-[20px]">
              <div className="animate-typingSent animation-delay-[200ms] bg-white rounded-full h-[7px] w-[7px] mr-[4px] align-middle inline-block" />
              <div className="animate-typingSent animation-delay-[300ms] bg-white rounded-full h-[7px] w-[7px] mr-[4px] align-middle inline-block" />
              <div className="animate-typingSent animation-delay-[400ms] bg-white rounded-full h-[7px] w-[7px] mr-[4px] align-middle inline-block" />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
