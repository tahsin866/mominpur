"use client";

import { useState } from "react";
import Link from "next/link";
import EventCard from "./event-card";

interface StatusResult {
  name: string;
  phone: string;
  status: string;
  submittedAt: string;
}

export default function StatusPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<StatusResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (!/^\d{11}$/.test(phone)) {
      setError("অনুগ্রহ করে ১১ ডিজিটের মোবাইল নম্বর দিন।");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/registrations/check-status?phone=${phone}`);
      if (res.status === 404) {
        setError("এই নম্বরে কোনো রেজিস্ট্রেশন পাওয়া যায়নি।");
      } else if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setError("সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
      }
    } catch {
      setError("সংযোগ করা যায়নি। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = (s: string) => {
    switch (s) {
      case "APPROVED":
        return { label: "অনুমোদিত", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: "✓" };
      case "REJECTED":
        return { label: "বাতিলকৃত", color: "text-red-700 bg-red-50 border-red-200", icon: "✕" };
      default:
        return { label: "পেন্ডিং", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: "⏳" };
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3D2A" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#064E3B" }}>
            আপনার আবেদনের স্ট্যাটাস দেখুন
          </h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            রেজিস্ট্রেশনের সময় ব্যবহৃত মোবাইল নম্বর দিন
          </p>
        </div>

        <form onSubmit={handleCheck} className="mb-8">
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              maxLength={11}
              pattern="\d{11}"
              className="flex-1 text-lg px-4 py-3 border rounded-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ borderColor: "rgba(10,61,42,0.2)" }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-white font-semibold rounded-sm hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: "#0A3D2A" }}
            >
              {loading ? "যাচাই হচ্ছে..." : "স্ট্যাটাস দেখুন"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-sm text-sm font-medium bg-red-50 text-red-700 border border-red-200 mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="p-6 rounded-sm border" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
            <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: "1px solid rgba(10,61,42,0.1)" }}>
              <div>
                <p className="text-sm" style={{ color: "#6B7280" }}>রেজিস্ট্রেশন ফলাফল</p>
                <p className="text-lg font-bold" style={{ color: "#064E3B" }}>{result.name}</p>
              </div>
              {(() => {
                const info = statusInfo(result.status);
                return (
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-sm border ${info.color}`}>
                    {info.icon} {info.label}
                  </span>
                );
              })()}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#6B7280" }}>মোবাইল নম্বর</span>
                <span className="font-medium" style={{ color: "#064E3B" }}>{result.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#6B7280" }}>আবেদনের তারিখ</span>
                <span className="font-medium" style={{ color: "#064E3B" }}>
                  {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString("bn-BD") : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#6B7280" }}>স্ট্যাটাস</span>
                <span className="font-medium" style={{ color: "#064E3B" }}>{result.status}</span>
              </div>
            </div>

            {result.status === "APPROVED" && (
              <>
                <div className="mt-4 p-3 rounded-sm text-sm" style={{ backgroundColor: "#ECFDF5", color: "#064E3B" }}>
                  আলহামদুলিল্লাহ! আপনার আবেদন অনুমোদিত হয়েছে। মিলনমেলায় আপনার অংশগ্রহণের জন্য অগ্রিম শুভেচ্ছা।
                </div>
                <EventCard name={result.name} phone={result.phone} />
              </>
            )}
            {result.status === "REJECTED" && (
              <div className="mt-4 p-3 rounded-sm text-sm" style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}>
                আপনার আবেদন বাতিল করা হয়েছে। বিস্তারিত জানতে যোগাযোগ করুন।
              </div>
            )}
            {result.status === "PENDING" && (
              <div className="mt-4 p-3 rounded-sm text-sm" style={{ backgroundColor: "#FFFBEB", color: "#92400E" }}>
                আপনার আবেদন বর্তমানে পর্যালোচনাধীন রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm" style={{ borderTop: "1px solid rgba(10,61,42,0.15)", color: "#6B7280" }}>
        <p>© ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর।</p>
      </footer>
    </div>
  );
}
