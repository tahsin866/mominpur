"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface Registration {
  id: number;
  name: string;
  phone: string;
  status: string;
  submittedAt: string;
}

interface DashboardStats {
  total: number;
  today: number;
  pending: number;
  approved: number;
  rejected: number;
  recent: Registration[];
}

function getUser(): UserData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

const STATUS_META: Record<string, { label: string; icon: string; badge: string; bar: string }> = {
  APPROVED: {
    label: "অনুমোদিত",
    icon: "✓",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
    bar: "bg-emerald-500",
  },
  PENDING: {
    label: "পেন্ডিং",
    icon: "⏳",
    badge:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900",
    bar: "bg-yellow-500",
  },
  REJECTED: {
    label: "বাতিল",
    icon: "✕",
    badge:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
    bar: "bg-red-500",
  },
};

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("bn-BD");
}

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<UserData | null>(() => getUser());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const token = user?.token;
    fetch("/api/registrations/stats", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("সার্ভার থেকে তথ্য পাওয়া যায়নি");
        return res.json();
      })
      .then((data: DashboardStats) => setStats(data))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "সমস্যা হয়েছে")
      )
      .finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
        {error || "পরিসংখ্যান লোড করা যায়নি"}
      </div>
    );
  }

  const cards = [
    {
      label: "মোট রেজিস্ট্রেশন",
      value: stats.total,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
      label: "আজকের রেজিস্ট্রেশন",
      value: stats.today,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      accent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      label: "পেন্ডিং",
      value: stats.pending,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    },
    {
      label: "অনুমোদিত",
      value: stats.approved,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
    },
    {
      label: "বাতিল",
      value: stats.rejected,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    },
  ];

  const maxCount = Math.max(stats.total, 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          স্বাগতম, {user.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          রেজিস্ট্রেশনের সাম্প্রতিক পরিসংখ্যান
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-sm border border-zinc-200 p-5 dark:bg-zinc-900 dark:border-zinc-800"
          >
            <div className={`w-9 h-9 rounded-sm flex items-center justify-center ${c.accent}`}>
              {c.icon}
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {c.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-sm border border-zinc-200 p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            স্ট্যাটাস অনুযায়ী রেজিস্ট্রেশন
          </h2>
          <div className="space-y-4">
            {(["APPROVED", "PENDING", "REJECTED"] as const).map((status) => {
              const meta = STATUS_META[status];
              const count = stats[status.toLowerCase() as "approved" | "pending" | "rejected"];
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-sm border bg-zinc-50 dark:bg-zinc-800">
                      {meta.icon} {meta.label}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {count} <span className="text-xs font-normal text-zinc-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-zinc-200 p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            সাম্প্রতিক রেজিস্ট্রেশন
          </h2>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              এখনো কোনো রেজিস্ট্রেশন নেই
            </p>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {stats.recent.map((r) => {
                const meta = STATUS_META[r.status] || STATUS_META.PENDING;
                return (
                  <div key={r.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {r.phone} · {formatDate(r.submittedAt)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-sm border ${meta.badge}`}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
