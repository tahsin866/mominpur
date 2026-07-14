"use client";

import { useEffect, useState } from "react";

interface Registration {
  id: number;
  name: string;
  fatherName: string;
  phone: string;
  whatsapp: string;
  studyFrom: string;
  studyTo: string;
  departments: string;
  permanentDivision: string;
  permanentDistrict: string;
  permanentThana: string;
  permanentAddressDetails: string;
  currentDivision: string;
  currentDistrict: string;
  currentThana: string;
  currentAddressDetails: string;
  occupation: string;
  occupationDetails: string;
  status: string;
  submittedAt: string;
}

export default function RegList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations/all`)
      .then((res) => {
        if (!res.ok) throw new Error("ডাটা লোড করা যায়নি");
        return res.json();
      })
      .then((data) => setRegistrations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${id}/status?status=${status}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("স্ট্যাটাস আপডেট হয়নি");
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত এটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("মুছে ফেলা যায়নি");
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
      case "REJECTED":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          রেজিস্ট্রেশন তালিকা
        </h1>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          মোট: {registrations.length}
        </span>
      </div>

      <div className="bg-white rounded-sm border border-zinc-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">নাম</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">পিতার নাম</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">ফোন</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">পড়াশোনা</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">বিভাগ</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">পেশা</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">স্ট্যাটাস</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">তারিখ</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    কোনো রেজিস্ট্রেশন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{r.name}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.fatherName}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.phone}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.studyFrom} - {r.studyTo}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.departments}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.occupation}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-sm ${statusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("bn-BD") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {r.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatus(r.id, "APPROVED")}
                              className="px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-sm dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => handleStatus(r.id, "REJECTED")}
                              className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-sm dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              বাতিল
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-sm dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          মুছুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
