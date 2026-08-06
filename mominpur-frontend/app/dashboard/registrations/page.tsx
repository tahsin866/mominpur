"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegList from "../../registration/reg/reg-list";

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem("user");
}

export default function RegistrationsPage() {
  const router = useRouter();
  // সার্ভারে localStorage নেই, তাই প্রথম রেন্ডারে সবসময় false — ক্লায়েন্টের
  // প্রথম রেন্ডারও false, ফলে হাইড্রেশন মিসম্যাচ হয় না। যাচাই মাউন্টের পরে।
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthorized(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">যাচাই হচ্ছে...</p>
      </div>
    );
  }

  return <RegList />;
}
