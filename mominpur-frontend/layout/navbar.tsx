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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md border-b border-zinc-200/60 sm:px-6 dark:bg-zinc-900/80 dark:border-zinc-800/60">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 lg:hidden dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            অ্যাডমিন প্যানেল
          </h2>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 hidden sm:block">
            ইত্তেহাদে আবনায়ে মুমিনপুর
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
        >
          <div
            id={`${id}-initial`}
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm"
          >
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <p id={`${id}-name`} suppressHydrationWarning className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {user?.role || "ADMIN"}
            </p>
          </div>
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-zinc-200/80 shadow-lg shadow-zinc-200/50 z-50 overflow-hidden dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-zinc-900/50">
              <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {user?.email || "admin"}
                </p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  লগ আউট
                </button>
              </div>
            </div>
          </>
        )}
      </div>

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
