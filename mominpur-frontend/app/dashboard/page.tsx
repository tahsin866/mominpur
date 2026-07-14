"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

function getUser(): UserData | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<UserData | null>(() => getUser());

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          স্বাগতম, {user.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm border border-zinc-200 p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            মোট রেজিস্ট্রেশন
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            --
          </p>
        </div>

        <div className="bg-white rounded-sm border border-zinc-200 p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            আজকের রেজিস্ট্রেশন
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            --
          </p>
        </div>

        <div className="bg-white rounded-sm border border-zinc-200 p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            আপনার ভূমিকা
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}
