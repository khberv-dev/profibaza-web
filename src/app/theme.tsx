import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";

export function AppTheme({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  );
}
