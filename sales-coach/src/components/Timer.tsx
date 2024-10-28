import { Text } from "@radix-ui/themes";

export const Timer = ({ secondsElapsed }: { secondsElapsed: number }) => {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  return (
    <Text
      size="2"
      className="text-gray-200"
    >{`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`}</Text>
  );
};
