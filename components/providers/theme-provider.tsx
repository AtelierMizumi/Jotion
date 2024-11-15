"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * @file Theme provider component for the application.
 * 
 * This file exports a ThemeProvider component that wraps its children with the NextThemesProvider,
 * allowing for theme management throughout the application.
 * 
 * @module ThemeProvider
 */

/**
 * ThemeProvider component that wraps its children with the NextThemesProvider.
 * 
 * @param {ThemeProviderProps} props - The properties passed to the ThemeProvider component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the ThemeProvider.
 * 
 * @returns {JSX.Element} The NextThemesProvider component wrapping the children.
 */

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
