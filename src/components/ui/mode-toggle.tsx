"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ModeToggle({ showText = false }) {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const handleToggle = () => {
    setCurrentTheme((prevTheme) => {
      if (prevTheme === "light") {
        setTheme("dark");
        return "dark";
      } else if (prevTheme === "dark") {
        setTheme("system");
        return "system";
      } else {
        setTheme("light");
        return "light";
      }
    });
  };

  if (currentTheme === undefined) {
    // Prevents mismatched initial render on the server and client
    return null;
  }

  return (
    <Button
      variant="ringHoverOutline"
      size="icon"
      onClick={handleToggle}
      className="relative flex items-center justify-center"
    >
      <AnimatePresence initial={false} mode="wait">
        {currentTheme === "light" && (
          <motion.div
            key="light"
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
        {currentTheme === "dark" && (
          <motion.div
            key="dark"
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
        {currentTheme === "system" && (
          <motion.div
            key="system"
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <DesktopIcon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
      </AnimatePresence>
      {showText && (
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={currentTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute ml-[6.4rem] text-sm"
          >
            {capitalizeFirstLetter(currentTheme)}
          </motion.span>
        </AnimatePresence>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
