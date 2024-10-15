import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DeviceSelectorProps {
  devices: Array<{ deviceId: string; label: string | null }>;
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
  icon: ReactNode;
  placeholderLabel: string;
}

export const DeviceSelector = ({
  devices,
  selectedDevice,
  onDeviceChange,
  icon,
  placeholderLabel,
}: DeviceSelectorProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  const selectedDeviceLabel =
    devices.find((device) => device.deviceId === selectedDevice)?.label ||
    placeholderLabel;

  useEffect(() => {
    if (open && triggerRef.current) {
      const width = triggerRef.current.offsetWidth;
      setMenuWidth(width);
    }
  }, [open]);

  return (
    <div className="flex items-center w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            className="w-full flex items-center justify-between border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300"
            data-state={open ? "open" : "closed"}
          >
            <div className="flex items-center">
              {icon}
              <span className="ml-2">{selectedDeviceLabel}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            align="start"
            sideOffset={8}
            style={{ width: menuWidth }}
            className="z-[1001]"
          >
            {devices.map((device) => (
              <DropdownMenuItem
                key={device.deviceId}
                onClick={() => {
                  onDeviceChange(device.deviceId);
                  setOpen(false);
                }}
              >
                {device.label || `Device ${device.deviceId}`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};
