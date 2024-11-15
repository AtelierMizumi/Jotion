"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * @fileoverview This file defines the ConvexClientProvider component which integrates Clerk authentication with Convex.
 */

/**
 * ConvexClientProvider component wraps its children with ClerkProvider and ConvexProviderWithClerk.
 * It provides authentication and Convex client context to its children components.
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The child components to be wrapped by the providers.
 * @returns {JSX.Element} The wrapped children components with authentication and Convex client context.
 */

export const ConvexClientProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk
        useAuth={useAuth}
        client={convex}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
