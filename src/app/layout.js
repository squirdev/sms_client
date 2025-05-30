"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";

import ReduxProvider from "../../redux/reduxProvider";
import { ScrollProvider } from "../../context/scrollContext";
import ScrollToTopButton from "./components/scrollToTop";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { eventBus } from "../../utils/axios";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathName = usePathname();

  const isHeaderShow = !pathName.includes("/login");

  useEffect(() => {
    const handleLogout = () => {
      router.push("/login");
    };

    eventBus.on("logout", handleLogout);
    return () => {
      eventBus.off("logout", handleLogout);
    };
  }, [router]);

  return (
    <html lang="en" translate="no" className="notranslate">
      <head>
        <meta name="googlebot" content="notranslate" />
        <meta name="google" content="notranslate" />
        <title>SMS client</title>
      </head>
      <body className="bg-gray-200 w-screen">
        <ReduxProvider>
          <div className="flex flex-col w-full">
            {isHeaderShow && <Header />}
            <div className="flex w-full justify-center h-full overflow-y-auto">
              {children}
            </div>
            <ScrollToTopButton />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
