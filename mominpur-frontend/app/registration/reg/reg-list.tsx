"use client";

import { useEffect, useState, useMemo } from "react";

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

interface Transaction {
  id: number;
  registrationId: number;
  transactionId: string;
  payingNumber: string;
  status: string;
  createdAt: string;
}

export default function RegList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterThana, setFilterThana] = useState("");
  const [filterOccupation, setFilterOccupation] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const [verifyInputs, setVerifyInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    const raw = localStorage.getItem("user");
    let token = "";
    try { token = JSON.parse(raw || "{}").token || ""; } catch { token = ""; }

    Promise.all([
      fetch("/api/registrations/all").then((res) => res.json()),
      fetch("/api/transactions/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then((res) => {
        if (!res.ok) return [];
        return res.json();
      }).catch(() => []),
    ])
      .then(([regData, txData]) => {
        setRegistrations(regData);
        setTransactions(Array.isArray(txData) ? txData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const divisions = useMemo(() => [...new Set(registrations.map((r) => r.permanentDivision).filter(Boolean))], [registrations]);
  const districts = useMemo(() => {
    if (!filterDivision) return [...new Set(registrations.map((r) => r.permanentDistrict).filter(Boolean))];
    return [...new Set(registrations.filter((r) => r.permanentDivision === filterDivision).map((r) => r.permanentDistrict).filter(Boolean))];
  }, [registrations, filterDivision]);
  const thanas = useMemo(() => {
    let filtered = registrations;
    if (filterDivision) filtered = filtered.filter((r) => r.permanentDivision === filterDivision);
    if (filterDistrict) filtered = filtered.filter((r) => r.permanentDistrict === filterDistrict);
    return [...new Set(filtered.map((r) => r.permanentThana).filter(Boolean))];
  }, [registrations, filterDivision, filterDistrict]);
  const occupations = useMemo(() => [...new Set(registrations.map((r) => r.occupation).filter(Boolean))], [registrations]);
  const departments = useMemo(() => {
    const all = registrations.map((r) => r.departments).filter(Boolean).flatMap((d) => d.split(",").map((s) => s.trim()));
    return [...new Set(all)];
  }, [registrations]);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        const match = [r.name, r.fatherName, r.phone, r.whatsapp].some((v) => v?.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (filterDivision && r.permanentDivision !== filterDivision) return false;
      if (filterDistrict && r.permanentDistrict !== filterDistrict) return false;
      if (filterThana && r.permanentThana !== filterThana) return false;
      if (filterOccupation && !r.occupation?.includes(filterOccupation)) return false;
      if (filterDepartment && !r.departments?.includes(filterDepartment)) return false;
      return true;
    });
  }, [registrations, search, filterDivision, filterDistrict, filterThana, filterOccupation, filterDepartment]);

  const clearFilters = () => {
    setSearch("");
    setFilterDivision("");
    setFilterDistrict("");
    setFilterThana("");
    setFilterOccupation("");
    setFilterDepartment("");
  };

  const getTransaction = (regId: number) => transactions.find((t) => t.registrationId === regId);

  const isVerified = (regId: number) => {
    const tx = getTransaction(regId);
    const input = verifyInputs[regId] || "";
    return tx && input.trim() === tx.transactionId.trim() && input.trim().length > 0;
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(
        `/api/registrations/${id}/status?status=${status}`,
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
        `/api/registrations/${id}`,
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

  const selectClass = "text-sm px-3 py-2 border border-zinc-200 rounded-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          রেজিস্ট্রেশন তালিকা
        </h1>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          মোট: {filtered.length} / {registrations.length}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="নাম, ফোন, পিতার নাম..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm px-3 py-2 border border-zinc-200 rounded-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 col-span-2 md:col-span-3 lg:col-span-1"
          />
          <select value={filterDivision} onChange={(e) => { setFilterDivision(e.target.value); setFilterDistrict(""); setFilterThana(""); }} className={selectClass}>
            <option value="">সব বিভাগ</option>
            {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setFilterThana(""); }} className={selectClass}>
            <option value="">সব জেলা</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterThana} onChange={(e) => setFilterThana(e.target.value)} className={selectClass}>
            <option value="">সব থানা</option>
            {thanas.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterOccupation} onChange={(e) => setFilterOccupation(e.target.value)} className={selectClass}>
            <option value="">সব পেশা</option>
            {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className={selectClass}>
            <option value="">সব শ্রেণী</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {(search || filterDivision || filterDistrict || filterThana || filterOccupation || filterDepartment) && (
          <button onClick={clearFilters} className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
            ফিল্টার মুছুন
          </button>
        )}
      </div>

      <div className="bg-white rounded-sm border border-zinc-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">নাম</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">ফোন</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">পড়াশোনা</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">পেশা</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">স্ট্যাটাস</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 min-w-[200px]">ট্রানজেকশন ID</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    কোনো রেজিস্ট্রেশন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const tx = getTransaction(r.id);
                  const verified = isVerified(r.id);
                  return (
                    <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{r.name}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.phone}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.studyFrom} - {r.studyTo}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{r.occupation}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-sm ${statusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {tx ? (
                          <div className="space-y-1.5">
                            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block">
                              {tx.transactionId}
                            </span>
                            {r.status === "PENDING" && (
                              <div>
                                <input
                                  type="text"
                                  placeholder="ID যাচাই করুন"
                                  value={verifyInputs[r.id] || ""}
                                  onChange={(e) => setVerifyInputs((prev) => ({ ...prev, [r.id]: e.target.value }))}
                                  className={`text-xs font-mono px-2 py-1 border rounded-sm w-full focus:outline-none focus:ring-1 ${
                                    verified
                                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-400"
                                      : (verifyInputs[r.id] || "").length > 0
                                      ? "border-red-300 bg-red-50 text-red-600 focus:ring-red-500 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                                      : "border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 focus:ring-emerald-500"
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {r.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleStatus(r.id, "APPROVED")}
                                disabled={!verified}
                                title={verified ? "অনুমোদন করুন" : "প্রথমে ট্রানজেকশন ID যাচাই করুন"}
                                className={`px-2 py-1 text-xs font-medium rounded-sm ${
                                  verified
                                    ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                    : "text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                                }`}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
