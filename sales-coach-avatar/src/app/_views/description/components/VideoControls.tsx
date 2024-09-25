import { Flex, Grid, Select } from "@radix-ui/themes";
import { Mic, Video } from "lucide-react";

export const VideoControls = ({
  cameras,
  microphones,
  selectedCamera,
  selectedMicrophone,
  onSelectCamera,
  onSelectMicrophone,
}: {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCamera: string;
  selectedMicrophone: string;
  onSelectCamera: (deviceId: string) => void;
  onSelectMicrophone: (deviceId: string) => void;
}) => {
  const data = {
    camera: { label: "Camera", icon: <Video /> },
    microphone: { label: "Microphone", icon: <Mic /> },
  };

  return (
    <Grid columns="1fr 1fr" gap="4" width="100%">
      <Flex align="center" gap="2" width="100%">
        <Select.Root
          value={selectedCamera}
          onValueChange={onSelectCamera}
          size="3"
        >
          <Select.Trigger style={{ width: "100%" }}>
            <Flex as="span" align="center" gap="2">
              {data.camera.icon}
              {cameras.find((camera) => camera.deviceId === selectedCamera)
                ?.label || data.camera.label}
            </Flex>
          </Select.Trigger>
          <Select.Content>
            {cameras.map((camera) => (
              <Select.Item key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
      <Flex align="center" gap="2" width="100%">
        <Select.Root
          value={selectedMicrophone}
          onValueChange={onSelectMicrophone}
          size="3"
        >
          <Select.Trigger style={{ width: "100%" }}>
            <Flex as="span" align="center" gap="2">
              {data.microphone.icon}
              {microphones.find((mic) => mic.deviceId === selectedMicrophone)
                ?.label || data.microphone.label}
            </Flex>
          </Select.Trigger>
          <Select.Content>
            {microphones.map((mic) => (
              <Select.Item key={mic.deviceId} value={mic.deviceId}>
                {mic.label || `Microphone ${mic.deviceId}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
    </Grid>
  );
};
