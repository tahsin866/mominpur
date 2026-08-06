"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const IDLE_TIMEOUT = 5 * 60 * 1000; // ৫ মিনিট

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const logout = useCallback(() => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    // লগইন না থাকলে সরাসরি redirect
    if (!sessionStorage.getItem("user")) {
      router.push("/login");
      return;
    }

    let timer = setTimeout(logout, IDLE_TIMEOUT);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, IDLE_TIMEOUT);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [logout, router]);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
