"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  
  // ফর্ম স্টেট
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // মেসেজ ও লোডিং স্টেট
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // আপনার ব্যাকএন্ড এপিআই ইউআরএল (প্রয়োজন অনুযায়ী পোর্ট পরিবর্তন করে নেবেন)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ব্যাকএন্ড থেকে badRequest().body(e.getMessage()) আসলে তা হ্যান্ডেল করবে
        throw new Error(data.message || "ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়");
      }

      // সফলভাবে লগইন হলে (AuthResponse) টোকেন বা ইউজার ডাটা লোকালস্টোরেজে সেভ করতে পারেন
      localStorage.setItem("user", JSON.stringify(data));
      
      alert("লগইন সফল হয়েছে!");
      
      // ড্যাশবোর্ডে রিডায়রেক্ট
      router.push("/dashboard");
      
    } catch (err: any) {
      setError(err.message || "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 items-center justify-center p-4 antialiased dark:bg-zinc-950">
      
      {/* ব্র্যান্ডিং এরিয়া */}
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          ইত্তেহাদে আবনায়ে মুমিনপুর
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          আপনার একাউন্টে লগইন করুন
        </p>
      </div>

      {/* লগইন কার্ড */}
      <main className="w-full max-w-md bg-white rounded-sm border border-zinc-200/80 shadow-sm p-6 md:p-8 dark:bg-zinc-900 dark:border-zinc-800">
        
        {/* এরর মেসেজ ডিসপ্লে */}
        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
            ⚠ {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* ইউজারনেম ইনপুট */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
              ইউজারনেম
            </label>
            <input 
              type="text" 
              placeholder="ইউজারনেম লিখুন"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          {/* পাসওয়ার্ড ইনপুট */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                পাসওয়ার্ড
              </label>
              <a 
                href="#" 
                className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          {/* রিমেম্বার মি চেকবক্স */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded-sm border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-zinc-600 dark:text-zinc-400">
              লগইন সেশন ধরে রাখুন
            </label>
          </div>

          {/* সাবমিট বাটন */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-sm hover:bg-emerald-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন"}
          </button>
        </form>

        {/* রেজিস্ট্রেশন লিংক */}
        <div className="mt-6 pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          এখনো রেজিস্ট্রেশন করেননি?{" "}
          <Link 
            href="/registration/reg" 
            className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            এখানে রেজিস্ট্রেশন করুন
          </Link>
        </div>

      </main>

      {/* ব্যাক টু হোম লিংক */}
      <div className="mt-4 text-center">
        <Link 
          href="/" 
          className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← মূল পাতায় ফিরে যান
        </Link>
      </div>

    </div>
  );
}
