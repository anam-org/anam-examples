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

export function SettingsView() {
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedPersona,
    setSelectedPersona,
    darkMode,
    setDarkMode,
    applyPersonaConfig,
  } = useSettingsContext();

  const handleSaveSettings = () => {
    applyPersonaConfig();
  };

  return (
    <Box className="flex items-center justify-center h-screen">
      <Box className="p-8 max-w-lg w-full mx-auto bg-white shadow-lg rounded-lg">
        <Heading size="8" className="mb-6 text-center">
          Persona Settings
        </Heading>

        {/* Language Preference */}
        <Box className="mb-6">
          <Heading size="6" className="mb-2">
            Configure Language Preference
          </Heading>
          <Text className="mb-4 text-gray-600">
            Select your preferred language.
          </Text>
          <Select.Root
            value={selectedLanguage}
            onValueChange={(value) =>
              setSelectedLanguage(value as LanguageType)
            }
          >
            <Select.Trigger className="w-full p-2 rounded-md">
              {selectedLanguage.charAt(0).toUpperCase() +
                selectedLanguage.slice(1)}
            </Select.Trigger>
            <Select.Content className="bg-white shadow-lg rounded-md p-2">
              <Select.Group>
                <Select.Label>Languages</Select.Label>
                <Select.Item value="french">French</Select.Item>
                <Select.Item value="spanish">Spanish</Select.Item>
                <Select.Item value="german">German</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Box>

        {/* Persona Mode */}
        <Box className="mb-6">
          <Heading size="6" className="mb-2">
            Persona Mode
          </Heading>
          <Text className="mb-4 text-gray-600">
            Choose the persona of the avatar.
          </Text>
          <Select.Root
            value={selectedPersona}
            onValueChange={(value) => setSelectedPersona(value as PersonaType)}
          >
            <Select.Trigger className="w-full p-2 rounded-md">
              {selectedPersona.charAt(0).toUpperCase() +
                selectedPersona.slice(1)}
            </Select.Trigger>
            <Select.Content className="bg-white shadow-lg rounded-md p-2">
              <Select.Group>
                <Select.Label>Personas</Select.Label>
                <Select.Item value="friendly">Friendly</Select.Item>
                <Select.Item value="professional">Professional</Select.Item>
                <Select.Item value="formal">Formal</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Box>

        {/* Dark Mode Toggle */}
        <Box className="mb-6">
          <Heading size="6" className="mb-2">
            Display Settings
          </Heading>
          <Flex align="center" justify="between" className="mb-4">
            <Text>Dark Mode</Text>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </Flex>
        </Box>

        <Flex justify="end" className="mt-6">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </Flex>
      </Box>
    </Box>
  );
}
