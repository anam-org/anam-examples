import { Flex, Select } from "@radix-ui/themes";
import MicNoneIcon from "@mui/icons-material/MicNone";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

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
  return (
    <Flex
      justify="center"
      align="center"
      gap="2"
      style={{
        position: "absolute",
        bottom: "0.5em",
      }}
    >
      <VideocamOutlinedIcon />
      <Select.Root
        defaultValue="Select Camera"
        value={selectedCamera}
        onValueChange={onSelectCamera}
        size="3"
      >
        <Select.Trigger />
        <Select.Content>
          {cameras.map((camera) => (
            <Select.Item key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `Camera ${camera.deviceId}`}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <MicNoneIcon />
      <Select.Root
        defaultValue="Select Microphone"
        value={selectedMicrophone}
        onValueChange={onSelectMicrophone}
        size="3"
      >
        <Select.Trigger />
        <Select.Content>
          {microphones.map((mic) => (
            <Select.Item key={mic.deviceId} value={mic.deviceId}>
              {mic.label || `Microphone ${mic.deviceId}`}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};
