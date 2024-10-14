import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export function Feedback() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Feedback Form */}
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
    </div>
  );
}
