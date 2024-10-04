"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Text,
  Switch,
} from "@radix-ui/themes";
import { LanguageType, PersonaType, useSettingsContext } from "@/contexts";
import { useTheme } from "next-themes";

// Utility function to capitalize first letter
const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export function SettingsView() {
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedPersona,
    setSelectedPersona,
    applyPersonaConfig,
  } = useSettingsContext();

  const { theme, setTheme } = useTheme();

  // This ensures that the dark mode switch is correctly synced with the current theme
  const isDarkMode = theme === "dark";

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleSaveSettings = () => {
    applyPersonaConfig();
    // Provide feedback to the user if needed
  };

  return (
    <Box className="flex items-center justify-center h-screen">
      <Box className="p-8 max-w-lg w-full mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <Heading
          size="8"
          className="mb-6 text-center text-gray-900 dark:text-white"
        >
          Persona Settings
        </Heading>

        {/* Language Preference */}
        <Box className="mb-6">
          <Heading size="6" className="mb-2 text-gray-800 dark:text-gray-200">
            Configure Language Preference
          </Heading>
          <Text className="mb-4 text-gray-600 dark:text-gray-400">
            Select your preferred language.
          </Text>
          <Select.Root
            value={selectedLanguage}
            onValueChange={(value) =>
              setSelectedLanguage(value as LanguageType)
            }
          >
            <Select.Trigger className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {capitalizeFirstLetter(selectedLanguage)}
            </Select.Trigger>
            <Select.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
              <Select.Group>
                <Select.Label className="text-gray-800 dark:text-gray-200">
                  Languages
                </Select.Label>
                <Select.Item value="french">French</Select.Item>
                <Select.Item value="spanish">Spanish</Select.Item>
                <Select.Item value="german">German</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Box>

        {/* Persona Mode */}
        <Box className="mb-6">
          <Heading size="6" className="mb-2 text-gray-800 dark:text-gray-200">
            Persona Mode
          </Heading>
          <Text className="mb-4 text-gray-600 dark:text-gray-400">
            Choose the persona of the avatar.
          </Text>
          <Select.Root
            value={selectedPersona}
            onValueChange={(value) => setSelectedPersona(value as PersonaType)}
          >
            <Select.Trigger className="w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {capitalizeFirstLetter(selectedPersona)}
            </Select.Trigger>
            <Select.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
              <Select.Group>
                <Select.Label className="text-gray-800 dark:text-gray-200">
                  Personas
                </Select.Label>
                <Select.Item value="friendly">Friendly</Select.Item>
                <Select.Item value="professional">Professional</Select.Item>
                <Select.Item value="formal">Formal</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Box>

        {/* Dark Mode Toggle */}
        <Box className="mb-6">
          <Heading size="6" className="mb-2 text-gray-800 dark:text-gray-200">
            Display Settings
          </Heading>
          <Flex align="center" justify="between" className="mb-4">
            <Text className="text-gray-800 dark:text-gray-200">Dark Mode</Text>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </Flex>
        </Box>

        <Flex justify="end" className="mt-6">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </Flex>
      </Box>
    </Box>
  );
}
