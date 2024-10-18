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
import { useViewportHeight } from "@/hooks";

/**
 * Capitalizes the first letter of the provided string.
 */
const capitalizeFirstLetter = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Renders the settings view for configuring language, persona, and display settings.
 * It allows users to change the language, persona type (friendly, professional, formal),
 * and toggle dark mode. The user can save their settings which will apply the persona
 * configuration.
 */
export default function Settings() {
  useViewportHeight();
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedPersona,
    setSelectedPersona,
    applyPersonaConfig,
  } = useSettingsContext();

  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  /**
   * Toggles the theme between light and dark mode.
   */
  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  /**
   * Handles the saving of settings by applying the current persona configuration.
   */
  const handleSaveSettings = () => {
    applyPersonaConfig();
  };

  return (
    <Flex
      align="center"
      justify="center"
      className="min-h-screen p-3 md:p-8 lg:p-10"
    >
      <Box
        className="p-3 sm:p-6 w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg"
      >
        <Heading
          size="8"
          className="mb-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-gray-900 dark:text-white"
        >
          Persona Settings
        </Heading>

        {/* Language Preference */}
        <Box mb="3">
          <Heading size="6" mb="2" className="text-lg sm:text-xl md:text-xl lg:text-2xl text-gray-800 dark:text-gray-200">
            Configure Language Preference
          </Heading>
          <Text mb="2" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            Select your preferred language.
          </Text>
          <Select.Root
            value={selectedLanguage}
            onValueChange={(value) =>
              setSelectedLanguage(value as LanguageType)
            }
          >
            <Select.Trigger className="w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {capitalizeFirstLetter(selectedLanguage)}
            </Select.Trigger>
            <Select.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md">
              <Select.Group>
                <Select.Label className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200">
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
        <Box mb="4">
          <Heading size="6" mb="1" className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-800 dark:text-gray-200">
            Persona Mode
          </Heading>
          <Text mb="2" className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            Choose the persona of the avatar.
          </Text>
          <Select.Root
            value={selectedPersona}
            onValueChange={(value) => setSelectedPersona(value as PersonaType)}
          >
            <Select.Trigger className="w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {capitalizeFirstLetter(selectedPersona)}
            </Select.Trigger>
            <Select.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md">
              <Select.Group>
                <Select.Label className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200">
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
        <Box mb="4">
          <Heading size="6" mb="1" className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-800 dark:text-gray-200">
            Display Settings
          </Heading>
          <Flex align="center" className="mb-4 gap-3">
            <Text className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200">Dark Mode</Text>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </Flex>
        </Box>

        <Flex justify="end" mt="5">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </Flex>
      </Box>
    </Flex>
  );
}
