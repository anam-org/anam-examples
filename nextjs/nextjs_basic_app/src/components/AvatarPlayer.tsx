export default function AvatarPlayer() {
  return (
    <div
      id="video-container"
      className="justify-center flex bg-grey-400 border-none w-[512px] h-[512px] rounded-xl overflow-hidden"
    >
      <video id="video" width="100%" autoPlay playsInline></video>
      <audio id="audio" autoPlay></audio>
    </div>
  );
}
