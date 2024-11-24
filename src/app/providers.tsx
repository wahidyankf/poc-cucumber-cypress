"use client";

import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import "@mantine/core/styles.css";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
  );
}
