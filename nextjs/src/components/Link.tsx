import NextLink from "next/link";

export default function Link({ href, text }: { href: string; text: string }) {
  return (
    <div className="h-39 w-[420px] rounded-lg p-[2px] bg-gradient-to-r from-backgroundStart to-backgroundEnd">
      <NextLink
        href={href}
        className="w-full h-full p-0rounded-md py-4 px-12 text-3xl font-light bg-panel text-text"
      >
        {text}
      </NextLink>
    </div>
  );
}
