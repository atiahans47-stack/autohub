import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalLiveChat from "@/components/common/ConditionalLiveChat";
import SuccessToast from "@/components/SuccessToast";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "AUTOHub - Car Rental & Sales Management System",
  description: "Find Your Perfect Ride Anytime, Anywhere. Rent or buy vehicles easily with secure booking and affordable prices.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <SuccessToast />
          {children}
          <ConditionalLiveChat />
        </AuthProvider>
      </body>
    </html>
  );
}