"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegList from "../../registration/reg/reg-list";

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("user");
}

export default function RegistrationsPage() {
  const router = useRouter();
  const [authorized] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    if (!authorized) {
      router.push("/login");
    }
  }, [authorized, router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">যাচাই হচ্ছে...</p>
      </div>
    );
  }

  return <RegList />;
}
