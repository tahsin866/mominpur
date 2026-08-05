"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useSearchParams } from "next/navigation";

interface VerifyResult {
  name: string;
  phone: string;
  status: string;
  submittedAt: string;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone");
  const autoPhone =
    typeof phoneParam === "string" && /^\d{11}$/.test(phoneParam)
      ? phoneParam
      : "";
  const [phone, setPhone] = useState(autoPhone);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(Boolean(autoPhone));
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const runCheck = useCallback(async (number: string) => {
    if (!/^\d{11}$/.test(number)) {
      return { error: "অনুগ্রহ করে ১১ ডিজিটের মোবাইল নম্বর দিন।" };
    }
    try {
      const res = await fetch(`/api/registrations/check-status?phone=${number}`);
      if (res.status === 404) {
        return { error: "এই নম্বরে কোনো রেজিস্ট্রেশন পাওয়া যায়নি।" };
      }
      if (res.ok) {
        return { result: (await res.json()) as VerifyResult };
      }
      return { error: "সার্ভারে সমস্যা হয়েছে।" };
    } catch {
      return { error: "সংযোগ করা যায়নি।" };
    }
  }, []);

  const verifyPhone = useCallback(
    async (number: string) => {
      setLoading(true);
      setError("");
      setResult(null);
      const outcome = await runCheck(number);
      if (outcome.error) {
        setError(outcome.error);
      } else if (outcome.result) {
        setResult(outcome.result);
      }
      setLoading(false);
    },
    [runCheck]
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyPhone(phone);
  };

  useEffect(() => {
    if (!autoPhone) return;
    let cancelled = false;
    runCheck(autoPhone).then((outcome) => {
      if (cancelled) return;
      if (outcome.error) {
        setError(outcome.error);
      } else if (outcome.result) {
        setResult(outcome.result);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [autoPhone, runCheck]);

  const handleNewSearch = () => {
    setPhone("");
    setResult(null);
    setError("");
    inputRef.current?.focus();
  };

  const isApproved = result?.status === "APPROVED";
  const isRejected = result?.status === "REJECTED";

  const statusLabel = (s: string) => {
    switch (s) {
      case "APPROVED": return "অনুমোদিত";
      case "REJECTED": return "বাতিলকৃত";
      default: return "পেন্ডিং";
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAF9" }}>
      {/* Header */}
      <header className="py-5 px-4" style={{ backgroundColor: "#0A3D2A" }}>
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">ভেরিফিকেশন প্যানেল</h1>
          </div>
          <Link href="/" className="text-sm hover:text-white transition" style={{ color: "#C9BFA6" }}>
            ← হোম
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10">
        {/* Search Form */}
        {!result && (
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0A3D2A" className="w-9 h-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#064E3B" }}>
              ব্যক্তি যাচাই করুন
            </h2>
            <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
              রেজিস্ট্রেশনে ব্যবহৃত মোবাইল নম্বর দিয়ে সরাসরি যাচাই করুন
            </p>

            <form onSubmit={handleVerify} className="max-w-sm mx-auto">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  pattern="\d{11}"
                  className="flex-1 text-lg px-4 py-3.5 border-2 rounded-lg bg-white focus:outline-none transition text-center tracking-widest font-semibold dark:bg-gray-800 dark:text-white"
                  style={{ borderColor: "#0A3D2A" }}
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 px-6 py-3.5 text-white font-bold text-lg rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                style={{ backgroundColor: "#0A3D2A" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    যাচাই হচ্ছে...
                  </span>
                ) : (
                  "যাচাই করুন"
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200 max-w-sm mx-auto">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Verification Result Card */}
        {result && (
          <div className="relative">
            {/* Large Verification Card */}
            <div
              className="rounded-2xl overflow-hidden shadow-xl border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: isApproved ? "#059669" : isRejected ? "#DC2626" : "#F59E0B",
                borderWidth: "2px",
              }}
            >
              {/* Top Status Bar */}
              <div
                className="py-4 px-6 text-center"
                style={{
                  backgroundColor: isApproved ? "#059669" : isRejected ? "#DC2626" : "#F59E0B",
                }}
              >
                {isApproved && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#059669" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-white text-xl font-black tracking-wide">
                      ভেরিফাইড ✓
                    </span>
                  </div>
                )}
                {isRejected && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#DC2626" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-white text-xl font-black tracking-wide">
                      বাতিলকৃত
                    </span>
                  </div>
                )}
                {!isApproved && !isRejected && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold" style={{ color: "#F59E0B" }}>⏳</span>
                    </div>
                    <span className="text-white text-xl font-black tracking-wide">
                      পেন্ডিং
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Person Info */}
                <div className="text-center mb-6 pb-6" style={{ borderBottom: "2px dashed #E5E7EB" }}>
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: isApproved ? "#059669" : isRejected ? "#DC2626" : "#F59E0B" }}
                  >
                    {result.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-black mb-1" style={{ color: "#111827" }}>
                    {result.name}
                  </h3>
                  <p className="text-base font-semibold" style={{ color: "#6B7280" }}>
                    মোঃ {result.phone}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#F0FDF4" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#059669" }}>স্ট্যাটাস</p>
                    <p className="text-base font-bold" style={{ color: "#064E3B" }}>
                      {statusLabel(result.status)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#F0FDF4" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#059669" }}>আবেদনের তারিখ</p>
                    <p className="text-base font-bold" style={{ color: "#064E3B" }}>
                      {result.submittedAt
                        ? new Date(result.submittedAt).toLocaleDateString("bn-BD")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* QR Code for this person */}
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <QRCodeSVG
                      value={
                        typeof window !== "undefined"
                          ? `${window.location.origin}/verify?phone=${result.phone}`
                          : result.phone
                      }
                      size={64}
                      bgColor="#FFFFFF"
                      fgColor="#0A3D2A"
                      level="M"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold mb-1" style={{ color: "#064E3B" }}>ব্যক্তিগত QR কোড</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      এই QR কোড স্ক্যান করে সরাসরি যাচাই করা যাবে
                    </p>
                  </div>
                </div>

                {/* Status Messages */}
                {isApproved && (
                  <div className="mt-4 p-4 rounded-xl text-sm font-medium" style={{ backgroundColor: "#ECFDF5", color: "#064E3B", border: "1px solid #A7F3D0" }}>
                    <p className="font-bold mb-1">✓ যাচাইকৃত অংশগ্রহণকারী</p>
                    <p>আলহামদুলিল্লাহ! এই ব্যক্তি মিলনমেলায় অংশগ্রহণের জন্য অনুমোদিত।</p>
                  </div>
                )}
                {isRejected && (
                  <div className="mt-4 p-4 rounded-xl text-sm font-medium" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
                    <p className="font-bold mb-1">✕ বাতিলকৃত আবেদন</p>
                    <p>এই ব্যক্তির আবেদন বাতিল করা হয়েছে।</p>
                  </div>
                )}
                {!isApproved && !isRejected && (
                  <div className="mt-4 p-4 rounded-xl text-sm font-medium" style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
                    <p className="font-bold mb-1">⏳ পর্যালোচনাধীন</p>
                    <p>এই ব্যক্তির আবেদন এখনো অনুমোদিত হয়নি।</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Search Button */}
            <button
              onClick={handleNewSearch}
              className="w-full mt-6 px-6 py-3.5 text-white font-bold rounded-lg hover:opacity-90 transition shadow-md"
              style={{ backgroundColor: "#0A3D2A" }}
            >
              + নতুন যাচাই করুন
            </button>
          </div>
        )}
      </main>

      <footer className="py-5 text-center text-sm" style={{ borderTop: "1px solid rgba(10,61,42,0.15)", color: "#6B7280", backgroundColor: "#FFFFFF" }}>
        <p>© ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর।</p>
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8FAF9" }}>
          <p className="text-sm text-zinc-500">লোড হচ্ছে...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
