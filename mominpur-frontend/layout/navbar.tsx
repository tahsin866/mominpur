"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { InlineScript } from "./inline-script";

const STORAGE_KEY = "user";

interface NavbarProps {
  onToggleSidebar: () => void;
}

interface UserData {
  name: string;
  email: string;
  role: string;
}

function getUser(): UserData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const [user] = useState<UserData | null>(() => getUser());
  const [showDropdown, setShowDropdown] = useState(false);
  const id = useId();

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-zinc-200 sm:px-6 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          অ্যাডমিন প্যানেল
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        >
          <div
            id={`${id}-initial`}
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm dark:bg-emerald-900/50 dark:text-emerald-400"
          >
            {user?.name?.charAt(0) || "A"}
          </div>
          <span id={`${id}-name`} suppressHydrationWarning className="hidden sm:block font-medium">
            {user?.name || "Admin"}
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-sm border border-zinc-200 shadow-sm z-50 dark:bg-zinc-800 dark:border-zinc-700">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {user?.email || "admin"} &middot; {user?.role || "ADMIN"}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  লগ আউট
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* হার্ড লোডে React হাইড্রেট হওয়ার আগেই localStorage থেকে নাম বসিয়ে দেয়,
          ফলে সার্ভারের "A"/"Admin" ফ্ল্যাশ করে না এবং হাইড্রেশন মিসম্যাচও হয় না। */}
      <InlineScript
        html={`{try{var u=JSON.parse(sessionStorage.getItem(${JSON.stringify(
          STORAGE_KEY
        )})||"null");if(u&&u.name){var a=document.getElementById(${JSON.stringify(
          `${id}-initial`
        )});if(a)a.textContent=u.name.charAt(0);var n=document.getElementById(${JSON.stringify(
          `${id}-name`
        )});if(n)n.textContent=u.name}}catch(e){}}`}
      />
    </header>
  );
}
