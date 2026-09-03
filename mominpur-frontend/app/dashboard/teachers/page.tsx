"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Teacher {
  id: number;
  name: string;
  fatherName: string;
  phone: string;
  department: string;
  occupation: string;
  occupationDetails: string;
  teachingFrom: string;
  teachingTo: string;
  division: string;
  district: string;
  thana: string;
  addressDetails: string;
  createdAt: string;
}

interface ThanaData {
  id: number;
  thanaName: string;
  thana: string;
}

interface DistrictData {
  desId: number;
  desname: string;
  district: string;
  thanas: ThanaData[];
}

interface DivisionData {
  id: number;
  dname: string;
  division: string;
  districts: DistrictData[];
}

const DEPARTMENTS = ["নাজেরা", "হিফজ", "কিতাব"];

const OCCUPATIONS = [
  "শিক্ষক", "ব্যবসায়ী", "চিকিৎসক", "ইঞ্জিনিয়ার", "আইনজীবী",
  "কৃষক", "সরকারি চাকুরি", "বেসরকারি চাকুরি", "অন্যান্য",
];

const startYear = 1963;
const currentYear = 2026;
const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => String(currentYear - i));

const inputClass =
  "w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";
const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5";

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
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

const emptyForm = { name: "", fatherName: "", phone: "", department: "", occupation: "", occupationDetails: "", teachingFrom: "", teachingTo: "", division: "", district: "", thana: "", addressDetails: "" };

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [divId, setDivId] = useState("");
  const [distId, setDistId] = useState("");
  const [thanaId, setThanaId] = useState("");

  const districts = divisions.find((d) => String(d.id) === divId)?.districts || [];
  const thanas = districts.find((d) => String(d.desId) === distId)?.thanas || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [occOpen, setOccOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchTeachers();
    fetch("/api/location/divisions")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setDivisions(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [router]);

  async function fetchTeachers() {
    try {
      const res = await fetch("/api/teachers/all", { headers: authHeaders() });
      if (!res.ok) throw new Error("তথ্য লোড করা যায়নি");
      setTeachers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setDivId("");
    setDistId("");
    setThanaId("");
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(t: Teacher) {
    setEditingId(t.id);
    setForm({ name: t.name || "", fatherName: t.fatherName || "", phone: t.phone || "", department: t.department || "", occupation: t.occupation || "", occupationDetails: t.occupationDetails || "", teachingFrom: t.teachingFrom || "", teachingTo: t.teachingTo || "", division: t.division || "", district: t.district || "", thana: t.thana || "", addressDetails: t.addressDetails || "" });
    const div = divisions.find((d) => d.division === t.division);
    setDivId(div ? String(div.id) : "");
    const dist = div?.districts.find((x) => x.district === t.district);
    setDistId(dist ? String(dist.desId) : "");
    const th = dist?.thanas.find((x) => x.thana === t.thana);
    setThanaId(th ? String(th.id) : "");
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(editingId ? `/api/teachers/${editingId}` : "/api/teachers/add", {
        method: editingId ? "PUT" : "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "সংরক্ষণ করা যায়নি");
      }
      const saved: Teacher = await res.json();
      setTeachers((prev) =>
        editingId
          ? prev.map((t) => (t.id === saved.id ? saved : t))
          : [...prev, saved].sort((a, b) => a.name.localeCompare(b.name))
      );
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(t: Teacher) {
    if (!confirm(`"${t.name}" কে মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/teachers/${t.id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error("মুছে ফেলা যায়নি");
      setTeachers((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "মুছে ফেলা যায়নি");
    }
  }

  const filtered = teachers.filter(
    (t) =>
      !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.phone?.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">শিক্ষক</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {teachers.length} জন শিক্ষক
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          নতুন শিক্ষক যোগ করুন
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Search */}
      {teachers.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-100 p-3 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <input
            type="text"
            placeholder="নাম / ফোন খুঁজুন"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 text-sm px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50/50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>
      )}

      {/* Teacher list */}
      {teachers.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-100 p-12 text-center dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <svg className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">কোনো শিক্ষক যোগ করা হয়নি</p>
          <button onClick={openAddModal} className="mt-4 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
            প্রথম শিক্ষক যোগ করুন
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  {["নাম", "পিতা", "মোবাইল", "পেশা", "পেশার বিস্তারিত", "শিক্ষাদান", "জামাত", "ঠিকানা", ""].map((col) => (
                    <th key={col} className="px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((t, i) => (
                  <tr key={t.id} className={i % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""}>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{t.name}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">{t.fatherName || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`tel:${t.phone}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{t.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">{t.occupation || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">{t.occupationDetails || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                      {t.teachingFrom || t.teachingTo ? `${t.teachingFrom || "?"} - ${t.teachingTo || "?"}` : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {t.department ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                          {t.department}
                        </span>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {[t.addressDetails, t.thana, t.district, t.division].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => openEditModal(t)}
                          className="px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-950/40"
                        >
                          এডিট
                        </button>
                        <button
                          onClick={() => handleDelete(t)}
                          className="px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          ডিলিট
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && teachers.length > 0 && (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">কিছু পাওয়া যায়নি</p>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {editingId ? "শিক্ষক এডিট করুন" : "নতুন শিক্ষক যোগ করুন"}
              </h2>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-5 space-y-4">
                <div>
                  <label className={labelClass}>নাম *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="শিক্ষকের পূর্ণ নাম"
                  />
                </div>
                <div>
                  <label className={labelClass}>পিতার নাম</label>
                  <input
                    type="text"
                    value={form.fatherName}
                    onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                    className={inputClass}
                    placeholder="পিতার নাম"
                  />
                </div>
                <div>
                  <label className={labelClass}>মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className={labelClass}>পেশা</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOccOpen((o) => !o)}
                      className={`w-full text-sm px-3 py-2.5 border rounded-lg bg-white dark:bg-zinc-800 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${occOpen ? "border-emerald-500" : "border-zinc-200 dark:border-zinc-700"} ${!form.occupation ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"}`}
                    >
                      <span className="truncate">{form.occupation || "নির্বাচন করুন"}</span>
                      <svg className={`w-4 h-4 ml-2 shrink-0 transition-transform ${occOpen ? "rotate-180" : ""} text-zinc-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {occOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {OCCUPATIONS.map((job) => (
                          <label key={job} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                            <input
                              type="checkbox"
                              className="accent-emerald-600"
                              checked={form.occupation.split(",").map((s) => s.trim()).filter(Boolean).includes(job)}
                              onChange={() => {
                                const current = form.occupation.split(",").map((s) => s.trim()).filter(Boolean);
                                const updated = current.includes(job) ? current.filter((j) => j !== job) : [...current, job];
                                setForm({ ...form, occupation: updated.join(", ") });
                              }}
                            />
                            {job}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>পেশার বিস্তারিত</label>
                  <input
                    type="text"
                    value={form.occupationDetails}
                    onChange={(e) => setForm({ ...form, occupationDetails: e.target.value })}
                    className={inputClass}
                    placeholder="প্রতিষ্ঠানের নাম, পদবী, বিবরণ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>শিক্ষাদান শুরু</label>
                    <select
                      value={form.teachingFrom}
                      onChange={(e) => setForm({ ...form, teachingFrom: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">শুরুর বছর</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>শিক্ষাদান শেষ</label>
                    <select
                      value={form.teachingTo}
                      onChange={(e) => setForm({ ...form, teachingTo: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">শেষের বছর</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>বিভাগ/জামাত</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDeptOpen((o) => !o)}
                      className={`w-full text-sm px-3 py-2.5 border rounded-lg bg-white dark:bg-zinc-800 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${deptOpen ? "border-emerald-500" : "border-zinc-200 dark:border-zinc-700"} ${!form.department ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"}`}
                    >
                      <span className="truncate">{form.department || "নির্বাচন করুন"}</span>
                      <svg className={`w-4 h-4 ml-2 shrink-0 transition-transform ${deptOpen ? "rotate-180" : ""} text-zinc-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {deptOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg">
                        {DEPARTMENTS.map((dept) => (
                          <label key={dept} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                            <input
                              type="checkbox"
                              className="accent-emerald-600"
                              checked={form.department.split(",").map((s) => s.trim()).filter(Boolean).includes(dept)}
                              onChange={() => {
                                const current = form.department.split(",").map((s) => s.trim()).filter(Boolean);
                                const updated = current.includes(dept) ? current.filter((d) => d !== dept) : [...current, dept];
                                setForm({ ...form, department: updated.join(", ") });
                              }}
                            />
                            {dept}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>বিভাগ</label>
                  <select
                    value={divId}
                    onChange={(e) => {
                      setDivId(e.target.value);
                      setDistId("");
                      setThanaId("");
                      const div = divisions.find((d) => String(d.id) === e.target.value);
                      setForm({ ...form, division: div?.division || "", district: "", thana: "" });
                    }}
                    className={inputClass}
                  >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>{d.division}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>জেলা</label>
                    <select
                      value={distId}
                      onChange={(e) => {
                        setDistId(e.target.value);
                        setThanaId("");
                        const dist = districts.find((d) => String(d.desId) === e.target.value);
                        setForm({ ...form, district: dist?.district || "", thana: "" });
                      }}
                      className={inputClass}
                      disabled={!divId}
                    >
                      <option value="">জেলা নির্বাচন করুন</option>
                      {districts.map((d) => (
                        <option key={d.desId} value={d.desId}>{d.district}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>থানা</label>
                    <select
                      value={thanaId}
                      onChange={(e) => {
                        setThanaId(e.target.value);
                        const th = thanas.find((t) => String(t.id) === e.target.value);
                        setForm({ ...form, thana: th?.thana || "" });
                      }}
                      className={inputClass}
                      disabled={!distId}
                    >
                      <option value="">থানা নির্বাচন করুন</option>
                      {thanas.map((t) => (
                        <option key={t.id} value={t.id}>{t.thana}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>ঠিকানার বিস্তারিত</label>
                  <textarea
                    rows={2}
                    value={form.addressDetails}
                    onChange={(e) => setForm({ ...form, addressDetails: e.target.value })}
                    className={inputClass}
                    placeholder="গ্রাম / রাস্তা / বাসা নম্বর ইত্যাদি"
                  />
                </div>
                {formError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
                )}
              </div>
              <div className="p-5 pt-0 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
