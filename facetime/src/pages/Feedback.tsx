import { DarkModeToggle } from "@/components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useViewportHeight } from "@/hooks";
import { useNavigate } from "react-router-dom";

export function Feedback() {
  useViewportHeight();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className="flex flex-col justify-between bg-gray-100 dark:bg-gray-900"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <header className="w-full max-w-[480px] bg-white dark:bg-gray-800 py-3 sm:py-4 shadow-md flex justify-between items-center px-3 sm:px-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          ANAM.AI
        </div>
        <DarkModeToggle />
      </header>

      {/* Feedback Form */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-[90vw] max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            We value your feedback!
          </h1>
          <Textarea
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Let us know how your video call went..."
          />
          <Button
            size="lg"
            onClick={handleGoHome}
            className="w-full mt-4 py-3 font-semibold rounded-lg"
          >
            Submit Feedback and Return Home
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[480px] 0 py-3 sm:py-4 shadow-md flex justify-center items-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          &copy; 2024 ANAM.AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
