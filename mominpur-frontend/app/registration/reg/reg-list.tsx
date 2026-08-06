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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

const STATUS = {
  APPROVED: {
    label: "অনুমোদিত",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  PENDING: {
    label: "পেন্ডিং",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  REJECTED: {
    label: "বাতিল",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  },
} as Record<string, { label: string; dot: string; badge: string }>;

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  Edit Modal                                                         */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";
const labelClass =
  "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5";

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
      const token = getToken();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              রেজিস্ট্রেশন সম্পাদনা
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">ID: {reg.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>নাম *</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>পিতার নাম *</label>
              <input name="fatherName" value={form.fatherName} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>মোবাইল নম্বর *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={11} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>হোয়াটসঅ্যাপ নম্বর *</label>
              <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} maxLength={11} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>অধ্যয়ন শুরু *</label>
              <input name="studyFrom" value={form.studyFrom} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>অধ্যয়ন শেষ *</label>
              <input name="studyTo" value={form.studyTo} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>বিভাগ/জামাত *</label>
              <input name="departments" value={form.departments} onChange={handleChange} placeholder="কমা দিয়ে আলাদা করুন" className={inputClass} required />
            </div>
          </div>

          {/* স্থায়ী ঠিকানা */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              স্থায়ী ঠিকানা
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>বিভাগ *</label>
                <input name="permanentDivision" value={form.permanentDivision} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>জেলা *</label>
                <input name="permanentDistrict" value={form.permanentDistrict} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>থানা *</label>
                <input name="permanentThana" value={form.permanentThana} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>বিস্তারিত *</label>
                <textarea name="permanentAddressDetails" value={form.permanentAddressDetails} onChange={handleChange} rows={2} className={inputClass} required />
              </div>
            </div>
          </div>

          {/* বর্তমান ঠিকানা */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              বর্তমান ঠিকানা
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>বিভাগ *</label>
                <input name="currentDivision" value={form.currentDivision} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>জেলা *</label>
                <input name="currentDistrict" value={form.currentDistrict} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>থানা *</label>
                <input name="currentThana" value={form.currentThana} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>বিস্তারিত *</label>
                <textarea name="currentAddressDetails" value={form.currentAddressDetails} onChange={handleChange} rows={2} className={inputClass} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>পেশা *</label>
              <input name="occupation" value={form.occupation} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>পেশার বিস্তারিত</label>
              <input name="occupationDetails" value={form.occupationDetails} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Drawer                                                      */
/* ------------------------------------------------------------------ */

function DetailDrawer({
  reg,
  tx,
  guestTxs,
  onClose,
}: {
  reg: Registration;
  tx: Transaction | undefined;
  guestTxs: Transaction[];
  onClose: () => void;
}) {
  const meta = STATUS[reg.status] || STATUS.PENDING;

  const fields = [
    { label: "পিতার নাম", value: reg.fatherName },
    { label: "ফোন", value: reg.phone },
    { label: "হোয়াটসঅ্যাপ", value: reg.whatsapp },
    { label: "অধ্যয়নকাল", value: `${reg.studyFrom} - ${reg.studyTo}` },
    { label: "বিভাগ/জামাত", value: reg.departments },
    { label: "পেশা", value: reg.occupation },
    { label: "পেশার বিস্তারিত", value: reg.occupationDetails },
    { label: "অতিথি সংখ্যা", value: reg.guestCount != null ? String(reg.guestCount) : "০" },
    { label: "জমা তারিখ", value: formatDate(reg.submittedAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 h-full overflow-y-auto shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">বিস্তারিত তথ্য</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Name & Status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{reg.name}</h3>
              <p className="text-sm text-zinc-400 mt-0.5">ID: #{reg.id}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${meta.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {fields.map((f) => f.value ? (
              <div key={f.label} className="flex justify-between items-start gap-4">
                <span className="text-sm text-zinc-400 dark:text-zinc-500 shrink-0">{f.label}</span>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 text-right">{f.value}</span>
              </div>
            ) : null)}
          </div>

          {/* Address */}
          <div className="space-y-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">স্থায়ী ঠিকানা</p>
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                {[reg.permanentAddressDetails, reg.permanentThana, reg.permanentDistrict, reg.permanentDivision].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">বর্তমান ঠিকানা</p>
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                {[reg.currentAddressDetails, reg.currentThana, reg.currentDistrict, reg.currentDivision].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>

          {/* Transaction */}
          {tx && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">রেজিস্ট্রেশন পেমেন্ট</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-600/70">ট্রানজেকশন ID</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{tx.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600/70">পেয়িং নম্বর</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">****{tx.payingNumber}</span>
                </div>
                {tx.receiverNumber && (
                  <div className="flex justify-between">
                    <span className="text-emerald-600/70">রিসিভার</span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">{tx.receiverNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-emerald-600/70">রেজি. ফি</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{tx.totalAmount} &#2547;</span>
                </div>
                {tx.paidAmount != null && (
                  <div className="flex justify-between">
                    <span className="text-emerald-600/70">প্রদত্ত</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{tx.paidAmount} &#2547;</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guest Add Transactions */}
          {guestTxs.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">অতিথি যোগের পেমেন্ট</p>
              {guestTxs.map((gtx, i) => {
                const statusMeta = gtx.status === "APPROVED"
                  ? { label: "অনুমোদিত", cls: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/50" }
                  : gtx.status === "REJECTED"
                  ? { label: "বাতিল", cls: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50" }
                  : { label: "পেন্ডিং", cls: "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50" };
                return (
                  <div key={gtx.id} className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 space-y-2 border border-amber-100 dark:border-amber-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300">{i + 1}</span>
                        </div>
                        <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                          {gtx.totalAmount / 510} জন অতিথি
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMeta.cls}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-amber-600/70">ট্রানজেকশন ID</span>
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{gtx.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-600/70">পেয়িং নম্বর</span>
                        <span className="font-medium text-amber-700 dark:text-amber-400">****{gtx.payingNumber}</span>
                      </div>
                      {gtx.receiverNumber && (
                        <div className="flex justify-between">
                          <span className="text-amber-600/70">রিসিভার</span>
                          <span className="font-medium text-amber-700 dark:text-amber-400">{gtx.receiverNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-amber-600/70">অতিথি ফি</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400">{gtx.totalAmount} &#2547;</span>
                      </div>
                      {gtx.paidAmount != null && (
                        <div className="flex justify-between">
                          <span className="text-amber-600/70">প্রদত্ত</span>
                          <span className="font-bold text-amber-700 dark:text-amber-400">{gtx.paidAmount} &#2547;</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Total Summary */}
              {tx && (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">মোট হিসাব</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">মোট দেয়</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {tx.totalAmount + guestTxs.reduce((s, g) => s + (g.totalAmount || 0), 0)} &#2547;
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">মোট প্রদত্ত</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {(tx.paidAmount || 0) + guestTxs.reduce((s, g) => s + (g.paidAmount || 0), 0)} &#2547;
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

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
  const [filterStatus, setFilterStatus] = useState("");
  const [filterReceiver, setFilterReceiver] = useState("");

  const [verifyInputs, setVerifyInputs] = useState<Record<number, string>>({});
  const [expandedTx, setExpandedTx] = useState<Record<number, boolean>>({});
  const [editing, setEditing] = useState<Registration | null>(null);
  const [viewing, setViewing] = useState<Registration | null>(null);

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
    let f = registrations;
    if (filterDivision) f = f.filter((r) => r.permanentDivision === filterDivision);
    if (filterDistrict) f = f.filter((r) => r.permanentDistrict === filterDistrict);
    return [...new Set(f.map((r) => r.permanentThana).filter(Boolean))];
  }, [registrations, filterDivision, filterDistrict]);
  const occupations = useMemo(() => {
    const all = registrations.map((r) => r.occupation).filter(Boolean).flatMap((o) => o.split(",").map((s) => s.trim()));
    return [...new Set(all)];
  }, [registrations]);
  const departmentsList = useMemo(() => {
    const all = registrations.map((r) => r.departments).filter(Boolean).flatMap((d) => d.split(",").map((s) => s.trim()));
    return [...new Set(all)];
  }, [registrations]);

  const receiverNumbers = useMemo(() => [...new Set(transactions.map((t) => t.receiverNumber).filter(Boolean))], [transactions]);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (![r.name, r.fatherName, r.phone, r.whatsapp].some((v) => v?.toLowerCase().includes(q))) return false;
      }
      if (filterStatus === "GUEST_PENDING") {
        if (!transactions.some((t) => t.registrationId === r.id && t.type === "GUEST_ADD" && t.status === "PENDING")) return false;
      } else if (filterStatus && r.status !== filterStatus) return false;
      if (filterDivision && r.permanentDivision !== filterDivision) return false;
      if (filterDistrict && r.permanentDistrict !== filterDistrict) return false;
      if (filterThana && r.permanentThana !== filterThana) return false;
      if (filterOccupation && !r.occupation?.includes(filterOccupation)) return false;
      if (filterDepartment && !r.departments?.includes(filterDepartment)) return false;
      if (filterReceiver) {
        if (!transactions.some((t) => t.registrationId === r.id && t.receiverNumber === filterReceiver)) return false;
      }
      return true;
    });
  }, [registrations, transactions, search, filterStatus, filterDivision, filterDistrict, filterThana, filterOccupation, filterDepartment, filterReceiver]);

  const hasFilters = !!(search || filterStatus || filterDivision || filterDistrict || filterThana || filterOccupation || filterDepartment || filterReceiver);

  const clearFilters = () => {
    setSearch(""); setFilterStatus(""); setFilterDivision(""); setFilterDistrict(""); setFilterThana(""); setFilterOccupation(""); setFilterDepartment(""); setFilterReceiver("");
  };

  const getTransaction = (regId: number) => transactions.find((t) => t.registrationId === regId && t.type !== "GUEST_ADD");
  const getGuestAddTransactions = (regId: number) => transactions.filter((t) => t.registrationId === regId && t.type === "GUEST_ADD");
  const getAllTransactions = (regId: number) => transactions.filter((t) => t.registrationId === regId);
  const getTotalAmount = (regId: number) => getAllTransactions(regId).reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const getTotalPaid = (regId: number) => getAllTransactions(regId).reduce((sum, t) => sum + (t.paidAmount || 0), 0);

  const isVerified = (regId: number) => {
    const tx = getTransaction(regId);
    const input = verifyInputs[regId] || "";
    return tx && input.trim() === tx.transactionId.trim() && input.trim().length > 0;
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/registrations/${id}/status?status=${status}`, { method: "PATCH", headers: authHeaders() });
      if (!res.ok) throw new Error("স্ট্যাটাস আপডেট হয়নি");
      setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    }
  };

  const handleTransactionStatus = async (txId: number, status: string, regId: number) => {
    try {
      const res = await fetch(`/api/transactions/${txId}/status?status=${status}`, { method: "PATCH", headers: authHeaders() });
      if (!res.ok) throw new Error("ট্রানজেকশন স্ট্যাটাস আপডেট হয়নি");
      // Update transaction in local state
      setTransactions((prev) => prev.map((t) => (t.id === txId ? { ...t, status } : t)));
      // If approved GUEST_ADD, refresh registration data to get updated guestCount
      if (status === "APPROVED") {
        const regRes = await fetch("/api/registrations/all", { headers: authHeaders() });
        if (regRes.ok) {
          const data = await regRes.json();
          setRegistrations(data);
        }
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত এটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error("মুছে ফেলা যায়নি");
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    }
  };

  const handleEditSave = (updated: Registration) => {
    setRegistrations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
  };

  const selectClass =
    "text-sm px-2.5 py-2 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";

  // Counts
  const pendingCount = registrations.filter((r) => r.status === "PENDING").length;
  const approvedCount = registrations.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = registrations.filter((r) => r.status === "REJECTED").length;
  const guestPendingCount = registrations.filter((r) =>
    transactions.some((t) => t.registrationId === r.id && t.type === "GUEST_ADD" && t.status === "PENDING")
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">লোড হচ্ছে...</p>
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            রেজিস্ট্রেশন তালিকা
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            মোট {registrations.length} জন নিবন্ধিত
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus(filterStatus === "PENDING" ? "" : "PENDING")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filterStatus === "PENDING" ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-white border-zinc-200 text-zinc-600 hover:border-amber-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            পেন্ডিং {pendingCount}
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === "APPROVED" ? "" : "APPROVED")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filterStatus === "APPROVED" ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-white border-zinc-200 text-zinc-600 hover:border-emerald-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            অনুমোদিত {approvedCount}
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === "REJECTED" ? "" : "REJECTED")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              filterStatus === "REJECTED" ? "bg-red-100 border-red-300 text-red-700" : "bg-white border-zinc-200 text-zinc-600 hover:border-red-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            বাতিল {rejectedCount}
          </button>
          {guestPendingCount > 0 && (
            <button
              onClick={() => {
                const newVal = filterStatus === "GUEST_PENDING" ? "" : "GUEST_PENDING";
                setFilterStatus(newVal);
                // Auto-expand all transactions when filtering guest pending
                if (newVal === "GUEST_PENDING") {
                  const expanded: Record<number, boolean> = {};
                  registrations.forEach((r) => {
                    if (transactions.some((t) => t.registrationId === r.id && t.type === "GUEST_ADD" && t.status === "PENDING")) {
                      expanded[r.id] = true;
                    }
                  });
                  setExpandedTx(expanded);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                filterStatus === "GUEST_PENDING"
                  ? "bg-orange-100 border-orange-300 text-orange-700"
                  : "bg-orange-50 border-orange-200 text-orange-600 hover:border-orange-300 animate-pulse dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-400"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              অতিথি আবেদন {guestPendingCount}
            </button>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-zinc-100 p-3 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="নাম / ফোন খুঁজুন"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm pl-8 pr-3 py-2 w-44 border border-zinc-200 rounded-lg bg-zinc-50/50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
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
            {departmentsList.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterReceiver} onChange={(e) => setFilterReceiver(e.target.value)} className={selectClass}>
            <option value="">সব একাউন্ট</option>
            {receiverNumbers.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="inline-flex items-center justify-center gap-1 text-xs font-medium px-2 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {hasFilters && (
        <p className="text-sm text-zinc-500">
          {filtered.length} জন পাওয়া গেছে
        </p>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50/80 border-b border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">#</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">নাম</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ফোন</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">টাকা গ্রহণকারী</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">পড়াশোনা</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 min-w-[200px]">ট্রানজেকশন যাচাই</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">রেজি. ফি</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">প্রদত্ত</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-center">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <svg className="w-10 h-10 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      <p className="text-sm">কোনো রেজিস্ট্রেশন পাওয়া যায়নি</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const tx = getTransaction(r.id);
                  const verified = isVerified(r.id);
                  const meta = STATUS[r.status] || STATUS.PENDING;
                  return (
                    <tr key={r.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3.5 text-zinc-400 text-xs font-mono">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setViewing(r)}
                          className="text-left hover:text-emerald-600 transition-colors"
                        >
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{r.name}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{r.fatherName}</p>
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-zinc-700 dark:text-zinc-300 font-mono text-xs">{r.phone}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-zinc-500 dark:text-zinc-400 font-mono text-xs">{tx?.receiverNumber || "-"}</p>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">{r.studyFrom} - {r.studyTo}</td>
                      <td className="px-5 py-3.5">
                        {(() => {
                          const guestTxs = getGuestAddTransactions(r.id);
                          const allTxs = getAllTransactions(r.id);
                          const pendingGuestCount = guestTxs.filter((g) => g.status === "PENDING").length;
                          const isExpanded = expandedTx[r.id] || false;

                          if (!tx && guestTxs.length === 0) {
                            return <span className="text-xs text-zinc-300 dark:text-zinc-600">পেমেন্ট নেই</span>;
                          }

                          return (
                            <div className="space-y-2">
                              {/* Summary Row - always visible */}
                              <div className="flex items-center gap-2">
                                {tx && (
                                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                                    {tx.transactionId}
                                  </span>
                                )}
                                {pendingGuestCount > 0 && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50 px-1.5 py-0.5 rounded-full animate-pulse">
                                    {pendingGuestCount} অতিথি আবেদন
                                  </span>
                                )}
                                {guestTxs.length > 0 && guestTxs.every((g) => g.status === "APPROVED") && (
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    ✓ {guestTxs.length} অতিথি
                                  </span>
                                )}
                              </div>

                              {/* Verify input for main registration */}
                              {tx && r.status === "PENDING" && (
                                <input
                                  type="text"
                                  placeholder="ID যাচাই করুন"
                                  value={verifyInputs[r.id] || ""}
                                  onChange={(e) => setVerifyInputs((prev) => ({ ...prev, [r.id]: e.target.value }))}
                                  className={`text-xs font-mono px-2.5 py-1.5 border rounded-lg w-full focus:outline-none focus:ring-2 transition-colors ${
                                    verified
                                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 focus:ring-emerald-500/20 dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-400"
                                      : (verifyInputs[r.id] || "").length > 0
                                      ? "border-red-300 bg-red-50 text-red-600 focus:ring-red-500/20 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                                      : "border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 focus:ring-emerald-500/20"
                                  }`}
                                />
                              )}

                              {/* Dropdown Toggle - only if multiple transactions */}
                              {allTxs.length > 1 && (
                                <button
                                  onClick={() => setExpandedTx((prev) => ({ ...prev, [r.id]: !prev[r.id] }))}
                                  className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                                >
                                  <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                  {isExpanded ? "সংকুচিত করুন" : `সব ট্রানজেকশন (${allTxs.length})`}
                                </button>
                              )}

                              {/* Expanded Dropdown Content */}
                              {isExpanded && (
                                <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                                  {/* Main Registration Tx */}
                                  {tx && (
                                    <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">রেজিস্ট্রেশন</span>
                                        <span className="text-[10px] text-emerald-600">{tx.totalAmount}৳</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">{tx.transactionId}</span>
                                        <span className="text-[10px] font-mono text-zinc-400">****{tx.payingNumber}</span>
                                      </div>
                                      {tx.receiverNumber && (
                                        <div className="text-[10px] text-zinc-400 mt-0.5">রিসিভার: {tx.receiverNumber}</div>
                                      )}
                                      <div className="text-[10px] text-zinc-400 mt-0.5">প্রদত্ত: {tx.paidAmount}৳</div>
                                    </div>
                                  )}

                                  {/* Guest Add Txs */}
                                  {guestTxs.map((gtx, gi) => (
                                    <div key={gtx.id} className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50 px-1.5 py-0.5 rounded">অতিথি #{gi + 1}</span>
                                          <span className="text-[10px] text-amber-600">{gtx.totalAmount / 510} জন • {gtx.totalAmount}৳</span>
                                        </div>
                                        {gtx.status === "APPROVED" && <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">✓</span>}
                                        {gtx.status === "REJECTED" && <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">✕</span>}
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400">{gtx.transactionId}</span>
                                        <span className="text-[10px] font-mono text-amber-500">****{gtx.payingNumber}</span>
                                      </div>
                                      {gtx.receiverNumber && (
                                        <div className="text-[10px] text-zinc-400 mt-0.5">রিসিভার: {gtx.receiverNumber}</div>
                                      )}
                                      <div className="text-[10px] text-zinc-400 mt-0.5">প্রদত্ত: {gtx.paidAmount}৳</div>
                                      {gtx.status === "PENDING" && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                          <button
                                            onClick={() => handleTransactionStatus(gtx.id, "APPROVED", r.id)}
                                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                                          >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            অনুমোদন
                                          </button>
                                          <button
                                            onClick={() => handleTransactionStatus(gtx.id, "REJECTED", r.id)}
                                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md text-red-600 bg-white border border-red-200 hover:bg-red-50 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800 transition-colors"
                                          >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            বাতিল
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {getAllTransactions(r.id).length > 0 ? (
                          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{getTotalAmount(r.id)} &#2547;</span>
                        ) : (
                          <span className="text-xs text-zinc-300 dark:text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {getAllTransactions(r.id).length > 0 ? (
                          <span className={`text-sm font-bold ${
                            getTotalPaid(r.id) >= getTotalAmount(r.id)
                              ? "text-emerald-600 dark:text-emerald-400"
                              : getTotalPaid(r.id) > 0
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-500"
                          }`}>
                            {getTotalPaid(r.id)} &#2547;
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300 dark:text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full ${meta.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => setViewing(r)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            দেখুন
                          </button>
                          <button
                            onClick={() => setEditing(r)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                            </svg>
                            সম্পাদনা
                          </button>
                          {r.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleStatus(r.id, "APPROVED")}
                                disabled={!verified}
                                title={verified ? "" : "প্রথমে ট্রানজেকশন ID যাচাই করুন"}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  verified
                                    ? "text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                                    : "text-zinc-400 bg-zinc-100 cursor-not-allowed dark:text-zinc-500 dark:bg-zinc-800"
                                }`}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75" />
                                </svg>
                                অনুমোদন
                              </button>
                              <button
                                onClick={() => handleStatus(r.id, "REJECTED")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950/30 dark:hover:bg-red-950/50 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                বাতিল
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950/30 dark:hover:bg-red-950/50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
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
        <EditModal reg={editing} onClose={() => setEditing(null)} onSave={handleEditSave} />
      )}

      {viewing && (
        <DetailDrawer reg={viewing} tx={getTransaction(viewing.id)} guestTxs={getGuestAddTransactions(viewing.id)} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
