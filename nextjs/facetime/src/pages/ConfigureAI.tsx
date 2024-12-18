import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnamContext } from "../contexts/AnamContext";
import { errorHandler } from "../utils";
import { LoaderCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { DarkModeToggle } from "@/components";
import { useViewportHeight } from "@/hooks";

export function ConfigureAI() {
  useViewportHeight();
  const navigate = useNavigate();
  const { createPersona, setPersonaConfig } = useAnamContext();
  const [description, setDescription] = useState("");
  const [personaPreset, setPersonaPreset] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Configuring AI...");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [dropdownOpen, personaPreset]);

  const personalityPresets = [
    { value: "friendly", label: "Friendly and welcoming" },
    { value: "professional", label: "Professional and formal" },
    { value: "humorous", label: "Humorous and fun" },
    { value: "concise", label: "Concise and to the point" },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    try {
      setLoadingText("Configuring AI...");

      setTimeout(() => setLoadingText("Generating AI..."), 1500);
      setTimeout(() => setLoadingText("Initializing..."), 3000);

      const personaInfo = {
        description,
        personality: personaPreset,
      };

      const createdPersonaPromise = createPersona(personaInfo);

      const [createdPersona] = await Promise.all([
        createdPersonaPromise,
        delay(4000),
      ]);

      if (createdPersona && createdPersona.id) {
        setPersonaConfig({ personaId: createdPersona.id });
      }

      navigate("/call");
    } catch (error) {
      errorHandler(error, "ConfigureAI Page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header with Back button */}
      <header className="w-full max-w-[480px] bg-white dark:bg-gray-800 py-4 shadow-md flex items-center justify-between px-4 min-h-[60px]">
        <button onClick={() => navigate("/")}>Back</button>
        <DarkModeToggle />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-[480px] px-4">
        {isLoading ? (
          <>
            {/* Loader Icon */}
            <LoaderCircle className="animate-spin text-blue-500 w-12 h-12 mb-4" />

            {/* Dynamic Configuring Text */}
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {loadingText}
            </div>
          </>
        ) : (
          <>
            {/* Heading "Configure" above the image */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Configure
            </h1>

            {/* Circular Image with light rings and shadow */}
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300 blur-xl"></div>{" "}
              {/* Outer light ring */}
              <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-300 to-purple-500 blur-md"></div>{" "}
              {/* Inner light ring */}
              <img
                src="/leo_gen_1_poster.jpg"
                alt="Leo"
                className="relative z-10 rounded-full w-full h-full object-cover shadow-lg"
              />
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <label className="block mb-2">
                  What kind of personality would you like to give Leo?
                </label>
                {/* Dropdown Menu from shadcn */}
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      ref={triggerRef}
                      className={`${
                        personaPreset
                          ? "text-black dark:text-white"
                          : "text-gray-500 dark:text-gray-500"
                      } text-base bg-transparent w-full flex justify-between items-center px-3 py-2 border dark:border-gray-600 rounded-md hover:bg-transparent hover:border-transparent`}
                    >
                      {personaPreset
                        ? personalityPresets.find(
                            (preset) => preset.value === personaPreset,
                          )?.label
                        : "Select a personality"}
                      {dropdownOpen ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-full"
                    style={{ width: triggerWidth }}
                  >
                    {personalityPresets.map((preset) => (
                      <DropdownMenuItem
                        className="text-base"
                        key={preset.value}
                        onSelect={() => setPersonaPreset(preset.value)}
                      >
                        {preset.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description Field */}
              <div>
                <label className="block">AI Description</label>
                <Textarea
                  className="text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 dark:border-gray-600 shadow-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe Leo's role or context"
                />
              </div>

              <Button
                size="lg"
                type="submit"
                className="w-full p-6 font-semibold rounded-lg focus:outline-none"
              >
                Continue to Video Call
              </Button>
            </form>
          </>
        )}
      </main>

      <footer className="mt-5 mb-5 max-w-[480px] w-full text-center">
        <p>&copy; 2024 ANAM.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
