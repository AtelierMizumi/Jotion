import { createClient } from "@liveblocks/client";
import type { useUser } from "@clerk/clerk-react";

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export function createLiveblocksClient(
  user: ReturnType<typeof useUser>["user"],
) {
  return createClient<{
    id: string;
    info: {
      name: string;
      color: string;
      picture: string;
    };
  }>({
    authEndpoint: async (room) => {
      const response = await fetch("/api/liveblocks-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room,
          userId: user?.id || "anonymous",
          userInfo: {
            name: user?.fullName || "Anonymous",
            color: getRandomColor(),
            picture:
              user?.imageUrl || "https://liveblocks.io/avatars/avatar-1.png",
          },
        }),
      });

      return response.json();
    },
  });
}

export default createLiveblocksClient;

// Default client for when user isn't available
export const defaultClient = createClient<{
  id: string;
  info: {
    name: string;
    color: string;
    picture: string;
  };
}>({
  authEndpoint: "/api/liveblocks-auth",
});
