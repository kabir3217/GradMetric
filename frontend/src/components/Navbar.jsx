"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid } from "react-icons/fi"; // Added FiGrid for Dashboard icon
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ initialUserStatus }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Initialize state with the value passed from the Server (layout.tsx)
  const [isLoggedIn, setIsLoggedIn] = useState(initialUserStatus);

  // Sync if the server prop updates
  useEffect(() => {
    setIsLoggedIn(initialUserStatus);
  }, [initialUserStatus]);

  // Hide navbar on auth pages
  const hiddenPaths = ["/auth/teacher/login", "/auth/teacher/signup"];
  if (hiddenPaths.includes(pathname)) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false); 
      router.push("/");
      router.refresh(); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <div
        className="bg-white/70 border-b border-slate-200/60"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={55}
              height={55}
              className="rounded-full shadow-sm"
            />
            <div className="leading-tight">
              <div className="text-slate-900 font-bold text-xl">
                Holistic Profiler
              </div>
              <div className="text-sm text-slate-600 -mt-1">
                CGPA • Notes • Voice
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-slate-700">
            {/* NEW: Dashboard Link (Only shows if logged in) */}
            {isLoggedIn && (
              <Link 
                href="/dashboard" 
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition flex items-center gap-2"
              >
                <FiGrid /> Dashboard
              </Link>
            )}

            <Link href="/features" className="hover:text-indigo-600 transition">
              Features
            </Link>
            <Link href="/works" className="hover:text-indigo-600 transition">
              How it works
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <Link
                href="/auth/teacher/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-purple-200 rounded-lg text-sm text-slate-700 hover:border-purple-500 transition"
              >
                <FiUser size={18} /> Teacher Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 shadow-sm border rounded-lg text-sm text-white hover:bg-red-600 transition"
              >
                <FiLogOut size={18} /> Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/80 border-t border-slate-200 py-4 px-6 space-y-4 backdrop-blur-lg">
            
            {/* NEW: Mobile Dashboard Link */}
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="block text-indigo-600 font-semibold hover:text-indigo-800"
                onClick={() => setMenuOpen(false)} // Close menu on click
              >
                <FiGrid className="inline mr-2" /> Dashboard
              </Link>
            )}

            <Link
              href="/features"
              className="block text-slate-800 hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/works"
              className="block text-slate-800 hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/contact"
              className="block text-slate-800 hover:text-indigo-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            {!isLoggedIn ? (
              <Link
                href="/auth/teacher/login"
                className="block w-full text-center px-4 py-2 mt-3 bg-white border border-purple-300 rounded-lg text-slate-700 hover:border-purple-500"
                onClick={() => setMenuOpen(false)}
              >
                <FiUser className="inline mr-2" />
                Teacher Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-center px-4 py-2 mt-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <FiLogOut className="inline mr-2" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}