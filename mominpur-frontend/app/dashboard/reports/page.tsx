"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentReport from "./payment-report";
import StudentReport from "./student-report";

interface Registration {
  id: number;
  name: string;
  fatherName: string;
  phone: string;
  studyFrom: string;
  studyTo: string;
  departments: string;
  permanentDivision: string;
  permanentDistrict: string;
  permanentThana: string;
  status: string;
  submittedAt: string;
  guestCount: number;
}

interface Transaction {
  id: number;
  registrationId: number;
  transactionId: string;
  payingNumber: string;
  receiverNumber: string;
  paidAmount: number;
  totalAmount: number;
  type: string;
  status: string;
  createdAt: string;
}

type Tab = "payment" | "student";

const getToken = (): string => {
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
    return JSON.parse(raw || "{}").token || "";
  } catch {
    return "";
  }
};

const authHeaders = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function ReportsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("payment");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch("/api/registrations/all", { headers: authHeaders() }).then((r) => {
        if (!r.ok) throw new Error("Failed to load registrations");
        return r.json();
      }),
      fetch("/api/transactions/all", { headers: authHeaders() }).then((r) => {
        if (!r.ok) throw new Error("Failed to load transactions");
        return r.json();
      }),
    ])
      .then(([regs, txns]) => {
        setRegistrations(regs);
        setTransactions(txns);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load data")
      )
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
        {error}
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "payment",
      label: "Payment Report",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
    },
    {
      key: "student",
      label: "Student Report",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Reports</h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
          Payment & student analytics and report downloads
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? "border-emerald-500 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "payment" ? (
        <PaymentReport transactions={transactions} />
      ) : (
        <StudentReport registrations={registrations} />
      )}
    </div>
  );
}
