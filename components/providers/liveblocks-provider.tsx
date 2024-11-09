"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import { MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <MantineProvider>
        {children}
      </MantineProvider>
    </LiveblocksProvider>
  );
}
