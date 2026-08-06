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

interface EditForm {
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
}

const editInputClass =
  "w-full text-sm px-3 py-2 border border-zinc-200 rounded-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const editLabelClass =
  "block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1";

function EditModal({
  reg,
  onClose,
  onSave,
}: {
  reg: Registration;
  onClose: () => void;
  onSave: (updated: Registration) => void;
}) {
  const [form, setForm] = useState<EditForm>({
    name: reg.name || "",
    fatherName: reg.fatherName || "",
    phone: reg.phone || "",
    whatsapp: reg.whatsapp || "",
    studyFrom: reg.studyFrom || "",
    studyTo: reg.studyTo || "",
    departments: reg.departments || "",
    permanentDivision: reg.permanentDivision || "",
    permanentDistrict: reg.permanentDistrict || "",
    permanentThana: reg.permanentThana || "",
    permanentAddressDetails: reg.permanentAddressDetails || "",
    currentDivision: reg.currentDivision || "",
    currentDistrict: reg.currentDistrict || "",
    currentThana: reg.currentThana || "",
    currentAddressDetails: reg.currentAddressDetails || "",
    occupation: reg.occupation || "",
    occupationDetails: reg.occupationDetails || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(form.phone)) {
      setError("মোবাইল নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
      return;
    }
    if (!/^\d{11}$/.test(form.whatsapp)) {
      setError("হোয়াটসঅ্যাপ নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const token = (() => { try { const raw = sessionStorage.getItem("user"); return JSON.parse(raw || "{}").token || ""; } catch { return ""; } })();
      const res = await fetch(`/api/registrations/${reg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "আপডেট হয়নি");
      }
      const saved = (await res.json()) as Registration;
      onSave(saved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-sm border border-zinc-200 shadow-xl max-h-[90vh] overflow-y-auto dark:bg-zinc-900 dark:border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            রেজিস্ট্রেশন সম্পাদনা করুন
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={editLabelClass}>নাম *</label>
              <input name="name" value={form.name} onChange={handleChange} className={editInputClass} required />
            </div>
            <div>
              <label className={editLabelClass}>পিতার নাম *</label>
              <input name="fatherName" value={form.fatherName} onChange={handleChange} className={editInputClass} required />
            </div>
            <div>
              <label className={editLabelClass}>মোবাইল নম্বর *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={11} className={editInputClass} required />
            </div>
            <div>
              <label className={editLabelClass}>হোয়াটসঅ্যাপ নম্বর *</label>
              <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} maxLength={11} className={editInputClass} required />
            </div>
            <div>
              <label className={editLabelClass}>অধ্যয়ন শুরু *</label>
              <input name="studyFrom" value={form.studyFrom} onChange={handleChange} className={editInputClass} required />
            </div>
            <div>
              <label className={editLabelClass}>অধ্যয়ন শেষ *</label>
              <input name="studyTo" value={form.studyTo} onChange={handleChange} className={editInputClass} required />
            </div>
            <div className="sm:col-span-2">
              <label className={editLabelClass}>বিভাগ/জামাত *</label>
              <input name="departments" value={form.departments} onChange={handleChange} placeholder="কমা দিয়ে আলাদা করুন" className={editInputClass} required />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">স্থায়ী ঠিকানা</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={editLabelClass}>বিভাগ *</label>
                <input name="permanentDivision" value={form.permanentDivision} onChange={handleChange} className={editInputClass} required />
              </div>
              <div>
                <label className={editLabelClass}>জেলা *</label>
                <input name="permanentDistrict" value={form.permanentDistrict} onChange={handleChange} className={editInputClass} required />
              </div>
              <div>
                <label className={editLabelClass}>থানা *</label>
                <input name="permanentThana" value={form.permanentThana} onChange={handleChange} className={editInputClass} required />
              </div>
              <div className="sm:col-span-3">
                <label className={editLabelClass}>গ্রাম/ঠিকানার বিস্তারিত *</label>
                <textarea name="permanentAddressDetails" value={form.permanentAddressDetails} onChange={handleChange} rows={2} className={editInputClass} required />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">বর্তমান ঠিকানা</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={editLabelClass}>বিভাগ *</label>
                <input name="currentDivision" value={form.currentDivision} onChange={handleChange} className={editInputClass} required />
              </div>
              <div>
                <label className={editLabelClass}>জেলা *</label>
                <input name="currentDistrict" value={form.currentDistrict} onChange={handleChange} className={editInputClass} required />
              </div>
              <div>
                <label className={editLabelClass}>থানা *</label>
                <input name="currentThana" value={form.currentThana} onChange={handleChange} className={editInputClass} required />
              </div>
              <div className="sm:col-span-3">
                <label className={editLabelClass}>বর্তমান ঠিকানার বিস্তারিত *</label>
                <textarea name="currentAddressDetails" value={form.currentAddressDetails} onChange={handleChange} rows={2} className={editInputClass} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={editLabelClass}>পেশা *</label>
              <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="কমা দিয়ে আলাদা করুন" className={editInputClass} required />
            </div>
            <div>
              <label className={editLabelClass}>পেশার বিস্তারিত</label>
              <input name="occupationDetails" value={form.occupationDetails} onChange={handleChange} className={editInputClass} />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-600 bg-zinc-100 rounded-sm hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-sm hover:bg-emerald-800 disabled:opacity-50"
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
  const [editing, setEditing] = useState<Registration | null>(null);

  const getToken = (): string => {
    try {
      const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
      return JSON.parse(raw || "{}").token || "";
    } catch { return ""; }
  };

  const authHeaders = (): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const headers = authHeaders();

    Promise.all([
      fetch("/api/registrations/all", { headers }).then((res) => {
        if (!res.ok) throw new Error("অনুমোদন প্রয়োজন");
        return res.json();
      }),
      fetch("/api/transactions/all", { headers }).then((res) => {
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
        { method: "PATCH", headers: authHeaders() }
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
        { method: "DELETE", headers: authHeaders() }
      );
      if (!res.ok) throw new Error("মুছে ফেলা যায়নি");
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    }
  };

  const handleEditSave = (updated: Registration) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setEditing(null);
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
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">পেয়িং নম্বর (শেষ ৪)</th>
                <th className="px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
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
                        {tx ? (
                          <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block">
                            {tx.payingNumber || "-"}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditing(r)}
                            className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-sm dark:text-blue-400 dark:hover:bg-blue-950/30"
                          >
                            সম্পাদনা
                          </button>
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

      {editing && (
        <EditModal
          reg={editing}
          onClose={() => setEditing(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
