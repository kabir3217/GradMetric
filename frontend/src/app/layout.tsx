import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Ensure path is correct
import { cookies } from "next/headers"; // Import cookies
import Footer from "@/components/Footer"; // Ensure path is correct
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Holistic Profiler",
  description: "Student Analytics Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Check if the token exists on the Server Side
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  const isLoggedIn = !!token; // simple boolean: true if token exists

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Pass the status to the Navbar */}
        <Navbar initialUserStatus={isLoggedIn} />
        {children}
        <Footer />
      </body>
    </html>
  );
}