"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("user");
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    return user.email || null;
  } catch {
    return null;
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      router.push("/login");
      return;
    }
    setEmail(userEmail);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("নতুন পাসওয়ার্ড মিলছে না");
      return;
    }

    if (newPassword.length < 6) {
      setError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "পাসওয়ার্ড পরিবর্তন করা যায়নি");
      }

      setSuccess("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          সেটিংস
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন
        </p>
      </div>

      <div className="max-w-md bg-white rounded-sm border border-zinc-200 p-6 dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          পাসওয়ার্ড পরিবর্তন করুন
        </h2>

        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-sm dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
              বর্তমান পাসওয়ার্ড
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
              নতুন পাসওয়ার্ড
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
              নতুন পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-sm hover:bg-emerald-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
