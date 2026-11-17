import { IconButton } from "@radix-ui/themes";
import { ComponentProps } from "react";

export const GhostIconButton = ({
  children,
  ...props
}: ComponentProps<typeof IconButton>) => (
  <IconButton variant="ghost" className="text-gray-200" {...props}>
    {children}
  </IconButton>
);
