import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PermissionsModal, DarkModeToggle } from "@/components";
import { useState } from "react";
import { useViewportHeight } from "@/hooks";

export function Home() {
  useViewportHeight();
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePermissionsGranted = () => {
    setModalVisible(false);
    navigate("/configure");
  };

  return (
    <>
      <div
        className="w-full overflow-x-hidden flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* Header */}
        <header className="w-full max-w-[480px] bg-white dark:bg-gray-800 py-3 sm:py-4 shadow-md flex justify-between items-center px-3 sm:px-4">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            ANAM.AI
          </div>
          <DarkModeToggle />
        </header>

        {/* Main content */}
        <main className="flex-grow flex flex-col items-center justify-center w-full max-w-[480px] px-3 sm:px-4 py-5 sm:py-6">
          <div className="text-center mb-4 sm:mb-5">
            <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Persona Facetime
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Enjoy real-time, interactive video conversations with your AI
              assistant.
            </p>
          </div>

          {/* Video Element */}
          <div className="w-full mb-4 sm:mb-5">
            <video
              className="w-full h-auto rounded-lg shadow-lg"
              poster="/leo_gen_1_poster.jpg"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/leo_gen_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Ready to Connect Section */}
          <Button
            onClick={handleOpenModal}
            className="w-full p-6 font-semibold rounded-lg focus:outline-none"
          >
            Start Video Call
          </Button>
        </main>

        {/* Footer */}
        <footer className="mb-4 sm:mb-5 text-gray-500 dark:text-gray-400 max-w-[480px] w-full text-center text-sm sm:text-base">
          <p>&copy; 2024 ANAM.AI. All rights reserved.</p>
        </footer>
      </div>

      {/* PermissionsModal */}
      {isModalVisible && (
        <PermissionsModal
          onClose={handleCloseModal}
          onPermissionGranted={handlePermissionsGranted}
        />
      )}
    </>
  );
}
