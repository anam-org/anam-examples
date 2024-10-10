import { IconButton } from "@radix-ui/themes";
import { ReactNode } from "react";

export const GhostIconButton = ({
  children,
  ...props
}: {
  children: ReactNode;
  [key: string]: any;
}) => (
  <IconButton variant="ghost" className="text-gray-200" {...props}>
    {children}
  </IconButton>
);
