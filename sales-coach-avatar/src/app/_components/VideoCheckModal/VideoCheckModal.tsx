import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { VideoControls } from "./VideoControls";

interface VideoCheckModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

export function VideoCheckModal({
  onClose,
  onPermissionGranted,
}: VideoCheckModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput",
          );
          const audioDevices = devices.filter(
            (device) => device.kind === "audioinput",
          );

          setCameras(videoDevices);
          setMicrophones(audioDevices);

          if (videoDevices.length > 0)
            setSelectedCamera(videoDevices[0].deviceId);
          if (audioDevices.length > 0)
            setSelectedMicrophone(audioDevices[0].deviceId);
        });
      })
      .catch((error) => {
        console.error("Permission denied", error);
      });
  }, []);

  useEffect(() => {
    let stream: MediaStream;

    if (selectedCamera && selectedMicrophone) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          },
          audio: {
            deviceId: selectedMicrophone
              ? { exact: selectedMicrophone }
              : undefined,
          },
        })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Permission denied", error);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedCamera, selectedMicrophone]);

  return (
    <>
      {/* Overlay */}
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      />
      {/* Modal */}
      <Grid
        position="fixed"
        columns="2fr 1fr"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          zIndex: 1000,
          padding: "0em 1em",
          width: "clamp(300px, 90vw, 1200px)",
          height: "clamp(300px, 80vh, 700px)",
        }}
      >
        <Flex
          height="100%"
          justify="center"
          align="center"
          direction="column"
          gap="2"
        >
          <Skeleton>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                width: "100%",
                height: "80%",
              }}
            />
          </Skeleton>
          <VideoControls
            cameras={cameras}
            microphones={microphones}
            selectedCamera={selectedCamera}
            selectedMicrophone={selectedMicrophone}
            onSelectCamera={setSelectedCamera}
            onSelectMicrophone={setSelectedMicrophone}
          />
        </Flex>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={{ padding: "1em" }}
        >
          <IconButton
            variant="ghost"
            style={{ position: "absolute", top: "0.5em", right: "0.5em" }}
            onClick={onClose}
          >
            <Cross2Icon />
          </IconButton>
          <Heading as="h2" size="3" mb="3">
            Ready to Start?
          </Heading>
          <Text mb="4" align="center">
            Before proceeding, we need to check your camera and microphone.
          </Text>
          <Flex gap="3">
            <Button
              size="4"
              style={{ borderRadius: "30px" }}
              onClick={onPermissionGranted}
            >
              Start Demo
            </Button>
          </Flex>
        </Flex>
      </Grid>
    </>
  );
}
