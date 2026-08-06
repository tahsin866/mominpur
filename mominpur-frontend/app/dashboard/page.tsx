"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const STATUS_META: Record<string, { label: string; dot: string; badge: string }> = {
  APPROVED: {
    label: "অনুমোদিত",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  PENDING: {
    label: "পেন্ডিং",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  REJECTED: {
    label: "বাতিল",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  },
};

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}

function formatTime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!stats) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
        {error || "পরিসংখ্যান লোড করা যায়নি"}
      </div>
    );
  }

  const cards = [
    {
      label: "মোট রেজিস্ট্রেশন",
      value: stats.total,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-white/20",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "আজকের রেজিস্ট্রেশন",
      value: stats.today,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: "পেন্ডিং",
      value: stats.pending,
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-white/20",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "অনুমোদিত",
      value: stats.approved,
      gradient: "from-teal-500 to-cyan-500",
      iconBg: "bg-white/20",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "বাতিল",
      value: stats.rejected,
      gradient: "from-rose-500 to-red-500",
      iconBg: "bg-white/20",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const maxCount = Math.max(stats.total, 1);
  const statusData = [
    { key: "APPROVED", count: stats.approved, color: "bg-emerald-500" },
    { key: "PENDING", count: stats.pending, color: "bg-amber-500" },
    { key: "REJECTED", count: stats.rejected, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            স্বাগতম, {user.name}
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            রেজিস্ট্রেশনের সাম্প্রতিক পরিসংখ্যান
          </p>
        </div>
        <Link
          href="/dashboard/registrations"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          সকল রেজিস্ট্রেশন
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${c.gradient} p-5 text-white shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                {c.icon}
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">{c.value}</p>
            <p className="mt-1 text-xs font-medium text-white/80 uppercase tracking-wider">
              {c.label}
            </p>
            {/* Decorative circle */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              স্ট্যাটাস অনুযায়ী
            </h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">মোট {stats.total} জন</span>
          </div>

          {/* Stacked bar */}
          <div className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex mb-6">
            {statusData.map((s) => {
              const pct = (s.count / maxCount) * 100;
              return pct > 0 ? (
                <div
                  key={s.key}
                  className={`h-full ${s.color} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${pct}%` }}
                />
              ) : null;
            })}
          </div>

          <div className="space-y-4">
            {statusData.map((s) => {
              const meta = STATUS_META[s.key];
              const pct = Math.round((s.count / maxCount) * 100);
              return (
                <div key={s.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{s.count}</span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 w-10 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              সাম্প্রতিক রেজিস্ট্রেশন
            </h2>
            <Link
              href="/dashboard/registrations"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              সব দেখুন
            </Link>
          </div>
          {stats.recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
              <svg className="w-10 h-10 mb-2 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-sm">এখনো কোনো রেজিস্ট্রেশন নেই</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {stats.recent.map((r, i) => {
                const meta = STATUS_META[r.status] || STATUS_META.PENDING;
                return (
                  <div key={r.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {r.phone} &middot; {formatDate(r.submittedAt)} {formatTime(r.submittedAt)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full ${meta.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
