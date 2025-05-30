import { LoginProvider } from "@/src/utils/authContext";

import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${fontInter.variable} antialiased w-full h-auto min-h-[100dvh] bg-zinc-100`}>
        <LoginProvider>
          {children}
        </LoginProvider>
      </body>
    </html>
  );
}
