"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserProfile } from "@/app/lib/api/user";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const [userInitials, setUserInitials] = useState("U");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!document.cookie.includes("token")) {
      router.push("/unauthorized");
    } else {
      setIsAuth(true);
      getUserProfile()
        .then((res) => {
          const user = res.user || res.data;
          if (user) {
            const first = user.name || "";
            const last = user.lastName || "";
            if (first && last) {
              setUserInitials(`${first[0]}${last[0]}`.toUpperCase());
            } else if (first) {
              setUserInitials(first[0].toUpperCase());
            }
          }
        })
        .catch(() => {
          setUserInitials("U");
        });
    }
  }, [router]);

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    document.cookie = "refreshToken=; Max-Age=0; path=/;";
    document.cookie = "role=; Max-Age=0; path=/;";
    toast.success("Logged out successfully");
    setTimeout(() => router.push("/login"), 1000);
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b px-4 sm:px-10">
        <div className="w-full px-0 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button className="text-2xl font-bold text-black cursor-pointer"  onClick={() => router.push("/dashboard")}>StudyHive</button>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-lg font-medium transition-colors">Dashboard</Link>
              <Link href="/notes" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-lg font-medium transition-colors">Notes</Link>
              <Link href="/reviews" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-lg font-medium transition-colors">Reviews</Link>
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex cursor-pointer items-center justify-center text-gray-900 hover:text-primary transition-colors focus:outline-none">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">{userInitials}</div>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button onClick={() => { setIsDropdownOpen(false); router.push("/profile"); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>Profile</span>
                      </div>
                    </button>
                    <button onClick={() => { setIsDropdownOpen(false); logout(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Nav Dropdown */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2 z-50">
            <Link href="/dashboard" className="block text-gray-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMobileNavOpen(false)}>Dashboard</Link>
            <Link href="/notes" className="block text-gray-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMobileNavOpen(false)}>Notes</Link>
            <Link href="/reviews" className="block text-gray-900 hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsMobileNavOpen(false)}>Reviews</Link>
            <button onClick={() => { setIsMobileNavOpen(false); router.push("/profile"); }} className="block w-full text-left px-3 py-2 text-base text-gray-900 hover:text-primary transition-colors">Profile</button>
            <button onClick={() => { setIsMobileNavOpen(false); logout(); }} className="block w-full text-left px-3 py-2 text-base text-red-600 hover:bg-red-50 transition-colors">Logout</button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-10">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10">
        <div className="w-full px-4 sm:px-10 py-8">
          {/* Desktop Footer */}
          <div className="hidden md:flex gap-20 xl:gap-40 items-start justify-between">
            <div className="flex gap-20 xl:gap-40">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-black mb-4">StudyHive</h3>
                <p className="text-gray-600 mb-4 max-w-md">Your AI-powered study companion. Organize notes, track progress, and master your subjects with intelligent study tools.</p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/dashboard"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/notes"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Notes
                    </a>
                  </li>
                  <li>
                    <a
                      href="/reviews"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a
                      href="/profile"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Profile
                    </a>
                  </li>
                </ul>
              </div>
              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Footer Image */}
            <div className="flex-shrink-0">
              <img 
                src="/images/footer-image.svg" 
                alt="StudyHive Footer Illustration" 
                className="w-48 h-auto"
              />
            </div>
          </div>
          {/* Mobile Footer Dropdown */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-md text-lg font-semibold text-black focus:outline-none">
              Footer Menu
              <svg className={`w-6 h-6 ml-2 transition-transform ${isMobileNavOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isMobileNavOpen && (
              <div className="mt-2 space-y-4 px-2">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Quick Links</h4>
                  <ul className="space-y-1">
                    <li><a href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">Dashboard</a></li>
                    <li><a href="/notes" className="text-gray-600 hover:text-primary transition-colors">Notes</a></li>
                    <li><a href="/reviews" className="text-gray-600 hover:text-primary transition-colors">Reviews</a></li>
                    <li><a href="/profile" className="text-gray-600 hover:text-primary transition-colors">Profile</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Support</h4>
                  <ul className="space-y-1">
                    <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Help Center</a></li>
                    <li><a href="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact Us</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
                <div className="flex space-x-4 mt-2">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between">
            <p className="text-gray-600 text-sm">© 2025 StudyHive. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlay to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
