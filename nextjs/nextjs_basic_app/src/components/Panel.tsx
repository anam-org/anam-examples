export default function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full minH-full max-w-7xl bg-gray-100 rounded-[64px] overflow-hidden drop-shadow-lg">
      {children}
    </div>
  );
}
