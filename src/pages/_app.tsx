// src/pages/_app.tsx
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Navbar from "@/components/ui/navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main
          className={`flex-1 transition-all duration-500 ease-in-out ${
            isSidebarOpen ? "md:ml-[220px]" : "md:ml-[75px]"
          }`}
        >
          <Component {...pageProps} />
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
