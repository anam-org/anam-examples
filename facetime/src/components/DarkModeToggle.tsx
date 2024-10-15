import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10"
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
