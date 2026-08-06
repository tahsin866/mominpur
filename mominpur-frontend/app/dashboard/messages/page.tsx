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

export default function MessagesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

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
      console.error("Failed to load messages");
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
      console.error("Failed to mark as read");
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
      console.error("Failed to delete message");
    }
  };

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500">যাচাই হচ্ছে...</p>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">বার্তা সমূহ</h1>
          <p className="text-sm text-zinc-500 mt-1">
            মোট {messages.length}টি বার্তা, {unreadCount}টি অপঠিত
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 text-sm font-medium rounded-sm bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          রিফ্রেশ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-zinc-500">লোড হচ্ছে...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-sm border border-zinc-200">
          <p className="text-zinc-500">কোনো বার্তা নেই।</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  if (msg.status === "UNREAD") markAsRead(msg.id);
                }}
                className={`p-4 rounded-sm border cursor-pointer transition ${
                  selected?.id === msg.id
                    ? "border-emerald-500 bg-emerald-50"
                    : msg.status === "UNREAD"
                    ? "border-zinc-200 bg-white hover:bg-zinc-50 border-l-4 border-l-emerald-500"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-zinc-900">{msg.name}</h3>
                  {msg.status === "UNREAD" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{msg.message}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  {new Date(msg.createdAt).toLocaleString("bn-BD")}
                </p>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white p-6 rounded-sm border border-zinc-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-900">{selected.name}</h2>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selected.status === "UNREAD"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {selected.status === "UNREAD" ? "অপঠিত" : "পঠিত"}
                    </span>
                    <button
                      onClick={() => deleteMessage(selected.id)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-zinc-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">ইমেইল</p>
                      <p className="text-sm text-zinc-900">{selected.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">ফোন</p>
                      <p className="text-sm text-zinc-900">{selected.phone || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">পাঠানোর সময়</p>
                    <p className="text-sm text-zinc-900">
                      {new Date(selected.createdAt).toLocaleString("bn-BD")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 mb-2">বার্তা</p>
                  <p className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-sm border border-zinc-200 text-center">
                <svg className="w-12 h-12 mx-auto text-zinc-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-zinc-500">একটি বার্তা নির্বাচন করুন</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
