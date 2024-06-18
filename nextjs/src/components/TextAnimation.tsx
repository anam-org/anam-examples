import { useEffect, useState } from "react";

export default function TextAnimation({
  content = "",
  speed = 30,
  onAnimateEnd,
  onAnimateStart,
  onAnimate,
}: {
  content: string;
  speed: number;
  onAnimateEnd?: () => void;
  onAnimateStart?: () => void;
  onAnimate?: () => void;
}) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((t) => {
        if (t.length >= content.length) {
          clearInterval(interval);
          return t;
        }
        return t + content[t.length];
      });
    }, speed);
    return () => clearInterval(interval);
  }, [content, speed, onAnimate]);

  // This useEffect will run each time `text` updates
  useEffect(() => {
    if (onAnimate) {
      onAnimate();
    }
  }, [text, onAnimate]);
  return <>{text}</>;
}
