"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem("user");
}

function getAuthHeaders(): HeadersInit {
  try {
    const raw = sessionStorage.getItem("user");
    const token = JSON.parse(raw || "{}").token || "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch { return {}; }
}

function formatDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} দিন আগে`;
  return formatDate(value);
}

export default function MessagesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthorized(auth);
    if (!auth) {
      router.push("/login");
      return;
    }
    fetchMessages();
  }, [router]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages/all", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.sort((a: Message, b: Message) => b.id - a.id));
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: "PATCH", headers: getAuthHeaders() });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "READ" } : m))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status: "READ" } : null));
      }
    } catch {
      // silent
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("আপনি কি এই বার্তা মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selected?.id === id) setSelected(null);
      }
    } catch {
      // silent
    }
  };

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;
  const readCount = messages.filter((m) => m.status === "READ").length;
  const filtered = filterStatus ? messages.filter((m) => m.status === filterStatus) : messages;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">বার্তা সমূহ</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            মোট {messages.length}টি বার্তা
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <button
            onClick={() => setFilterStatus("")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              !filterStatus
                ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            সব ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === "UNREAD" ? "" : "UNREAD")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filterStatus === "UNREAD"
                ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            অপঠিত ({unreadCount})
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === "READ" ? "" : "READ")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filterStatus === "READ"
                ? "bg-zinc-200 border-zinc-400 text-zinc-700 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            পঠিত ({readCount})
          </button>

          {/* Refresh */}
          <button
            onClick={fetchMessages}
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
            title="রিফ্রেশ"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm text-zinc-400">লোড হচ্ছে...</p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">কোনো বার্তা নেই</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">নতুন বার্তা আসলে এখানে দেখা যাবে</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5 items-start">
          {/* Message List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
            <div className="max-h-[75vh] overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-400">ফিল্টারে কোনো বার্তা নেই</div>
              ) : (
                filtered.map((msg) => {
                  const isActive = selected?.id === msg.id;
                  const isUnread = msg.status === "UNREAD";
                  return (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelected(msg);
                        if (isUnread) markAsRead(msg.id);
                      }}
                      className={`px-4 py-3.5 cursor-pointer transition-colors ${
                        isActive
                          ? "bg-emerald-50/80 dark:bg-emerald-950/20"
                          : "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          isUnread
                            ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                          {msg.name?.charAt(0) || "?"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className={`text-sm truncate ${
                              isUnread ? "font-bold text-zinc-900 dark:text-zinc-100" : "font-medium text-zinc-700 dark:text-zinc-300"
                            }`}>
                              {msg.name}
                            </h3>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0 whitespace-nowrap">
                              {timeAgo(msg.createdAt)}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 line-clamp-2 ${
                            isUnread ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-500"
                          }`}>
                            {msg.message}
                          </p>
                        </div>

                        {/* Unread dot */}
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                {/* Detail Header */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      selected.status === "UNREAD"
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {selected.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{selected.name}</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {formatDate(selected.createdAt)} {formatTime(selected.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      selected.status === "UNREAD"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {selected.status === "UNREAD" ? "অপঠিত" : "পঠিত"}
                    </span>
                    <button
                      onClick={() => deleteMessage(selected.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950/30 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      মুছুন
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="px-6 py-4 border-b border-zinc-50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex flex-wrap gap-4">
                    {selected.email && (
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {selected.email}
                      </div>
                    )}
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {selected.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message body */}
                <div className="px-6 py-5">
                  <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">একটি বার্তা নির্বাচন করুন</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">বাম পাশ থেকে বার্তা ক্লিক করুন</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
