"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, jsonHeaders } from "@/lib/auth";
import { inputClass, labelClass, BLOOD_GROUPS } from "@/lib/constants";
import { fetchDivisions } from "@/lib/address";
import type { DivisionData } from "@/lib/address";

interface Student {
  id: number;
  name: string;
  fatherName: string;
  phone: string;
  bloodGroup: string;
  permanentDivision: string;
  permanentDistrict: string;
  permanentThana: string;
  permanentAddressDetails: string;
  currentDivision: string;
  currentDistrict: string;
  currentThana: string;
  currentAddressDetails: string;
  createdAt: string;
}

const emptyForm = {
  name: "",
  fatherName: "",
  phone: "",
  bloodGroup: "",
  permanentDivision: "",
  permanentDistrict: "",
  permanentThana: "",
  permanentAddressDetails: "",
  currentDivision: "",
  currentDistrict: "",
  currentThana: "",
  currentAddressDetails: "",
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [permDivId, setPermDivId] = useState("");
  const [permDistId, setPermDistId] = useState("");
  const [permThanaId, setPermThanaId] = useState("");
  const [currDivId, setCurrDivId] = useState("");
  const [currDistId, setCurrDistId] = useState("");
  const [currThanaId, setCurrThanaId] = useState("");

  const permDistricts = divisions.find((d) => String(d.id) === permDivId)?.districts || [];
  const permThanas = permDistricts.find((d) => String(d.desId) === permDistId)?.thanas || [];
  const currDistricts = divisions.find((d) => String(d.id) === currDivId)?.districts || [];
  const currThanas = currDistricts.find((d) => String(d.desId) === currDistId)?.thanas || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students/all", { headers: jsonHeaders() });
      if (!res.ok) throw new Error("তথ্য লোড করা যায়নি");
      setStudents(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchStudents();
    fetchDivisions().then((data) => setDivisions(data));
  }, [router]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setPermDivId("");
    setPermDistId("");
    setPermThanaId("");
    setCurrDivId("");
    setCurrDistId("");
    setCurrThanaId("");
    setSameAddress(false);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(s: Student) {
    setEditingId(s.id);
    setForm({
      name: s.name || "",
      fatherName: s.fatherName || "",
      phone: s.phone || "",
      bloodGroup: s.bloodGroup || "",
      permanentDivision: s.permanentDivision || "",
      permanentDistrict: s.permanentDistrict || "",
      permanentThana: s.permanentThana || "",
      permanentAddressDetails: s.permanentAddressDetails || "",
      currentDivision: s.currentDivision || "",
      currentDistrict: s.currentDistrict || "",
      currentThana: s.currentThana || "",
      currentAddressDetails: s.currentAddressDetails || "",
    });
    const pdiv = divisions.find((d) => d.division === s.permanentDivision);
    setPermDivId(pdiv ? String(pdiv.id) : "");
    const pdist = pdiv?.districts.find((x) => x.district === s.permanentDistrict);
    setPermDistId(pdist ? String(pdist.desId) : "");
    const pth = pdist?.thanas.find((x) => x.thana === s.permanentThana);
    setPermThanaId(pth ? String(pth.id) : "");
    const cdiv = divisions.find((d) => d.division === s.currentDivision);
    setCurrDivId(cdiv ? String(cdiv.id) : "");
    const cdist = cdiv?.districts.find((x) => x.district === s.currentDistrict);
    setCurrDistId(cdist ? String(cdist.desId) : "");
    const cth = cdist?.thanas.find((x) => x.thana === s.currentThana);
    setCurrThanaId(cth ? String(cth.id) : "");
    setSameAddress(
      (!!s.permanentDivision || !!s.permanentAddressDetails) &&
        s.permanentDivision === s.currentDivision &&
        s.permanentDistrict === s.currentDistrict &&
        s.permanentThana === s.currentThana &&
        s.permanentAddressDetails === s.currentAddressDetails
    );
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(editingId ? `/api/students/${editingId}` : "/api/students/add", {
        method: editingId ? "PUT" : "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "সংরক্ষণ করা যায়নি");
      }
      const saved: Student = await res.json();
      setStudents((prev) =>
        editingId
          ? prev.map((s) => (s.id === saved.id ? saved : s))
          : [...prev, saved].sort((a, b) => a.name.localeCompare(b.name))
      );
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: Student) {
    if (!confirm(`"${s.name}" কে মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/students/${s.id}`, { method: "DELETE", headers: jsonHeaders() });
      if (!res.ok) throw new Error("মুছে ফেলা যায়নি");
      setStudents((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "মুছে ফেলা যায়নি");
    }
  }

  const filtered = students.filter(
    (s) =>
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search)
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
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">শিক্ষার্থী</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {students.length} জন শিক্ষার্থী
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          নতুন শিক্ষার্থী যোগ করুন
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Search */}
      {students.length > 0 && (
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

      {/* Student list */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-100 p-12 text-center dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <svg className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">কোনো শিক্ষার্থী যোগ করা হয়নি</p>
          <button onClick={openAddModal} className="mt-4 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
            প্রথম শিক্ষার্থী যোগ করুন
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  {["নাম", "পিতা", "মোবাইল", "রক্তের গ্রুপ", "স্থায়ী ঠিকানা", "বর্তমান ঠিকানা", ""].map((col) => (
                    <th key={col} className="px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""}>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">{s.fatherName || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`tel:${s.phone}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{s.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                      {s.bloodGroup ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
                          {s.bloodGroup}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {[s.permanentAddressDetails, s.permanentThana, s.permanentDistrict, s.permanentDivision].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {[s.currentAddressDetails, s.currentThana, s.currentDistrict, s.currentDivision].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => openEditModal(s)}
                          className="px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-950/40"
                        >
                          এডিট
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
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

      {filtered.length === 0 && students.length > 0 && (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">কিছু পাওয়া যায়নি</p>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {editingId ? "শিক্ষার্থী এডিট করুন" : "নতুন শিক্ষার্থী যোগ করুন"}
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
                    placeholder="শিক্ষার্থীর পূর্ণ নাম"
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
                  <label className={labelClass}>রক্তের গ্রুপ</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {BLOOD_GROUPS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Permanent Address */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">স্থায়ী ঠিকানা</p>
                  <div>
                    <label className={labelClass}>বিভাগ</label>
                    <select
                      value={permDivId}
                      onChange={(e) => {
                        setPermDivId(e.target.value);
                        setPermDistId("");
                        setPermThanaId("");
                        const div = divisions.find((d) => String(d.id) === e.target.value);
                        setForm({ ...form, permanentDivision: div?.division || "", permanentDistrict: "", permanentThana: "" });
                      }}
                      className={inputClass}
                    >
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>{d.division}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className={labelClass}>জেলা</label>
                      <select
                        value={permDistId}
                        onChange={(e) => {
                          setPermDistId(e.target.value);
                          setPermThanaId("");
                          const dist = permDistricts.find((d) => String(d.desId) === e.target.value);
                          setForm({ ...form, permanentDistrict: dist?.district || "", permanentThana: "" });
                        }}
                        className={inputClass}
                        disabled={!permDivId}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {permDistricts.map((d) => (
                          <option key={d.desId} value={d.desId}>{d.district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>থানা</label>
                      <select
                        value={permThanaId}
                        onChange={(e) => {
                          setPermThanaId(e.target.value);
                          const th = permThanas.find((t) => String(t.id) === e.target.value);
                          setForm({ ...form, permanentThana: th?.thana || "" });
                        }}
                        className={inputClass}
                        disabled={!permDistId}
                      >
                        <option value="">থানা নির্বাচন করুন</option>
                        {permThanas.map((t) => (
                          <option key={t.id} value={t.id}>{t.thana}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className={labelClass}>ঠিকানার বিস্তারিত</label>
                    <textarea
                      rows={2}
                      value={form.permanentAddressDetails}
                      onChange={(e) => setForm({ ...form, permanentAddressDetails: e.target.value })}
                      className={inputClass}
                      placeholder="গ্রাম / রাস্তা / বাসা নম্বর ইত্যাদি"
                    />
                  </div>
                </div>

                {/* Current Address */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">বর্তমান ঠিকানা</p>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sameAddress}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSameAddress(checked);
                          if (checked) {
                            setCurrDivId(permDivId);
                            setCurrDistId(permDistId);
                            setCurrThanaId(permThanaId);
                            setForm((prev) => ({
                              ...prev,
                              currentDivision: prev.permanentDivision,
                              currentDistrict: prev.permanentDistrict,
                              currentThana: prev.permanentThana,
                              currentAddressDetails: prev.permanentAddressDetails,
                            }));
                          } else {
                            setCurrDivId("");
                            setCurrDistId("");
                            setCurrThanaId("");
                            setForm((prev) => ({
                              ...prev,
                              currentDivision: "",
                              currentDistrict: "",
                              currentThana: "",
                              currentAddressDetails: "",
                            }));
                          }
                        }}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">স্থায়ী ঠিকানার সাথে একই</span>
                    </label>
                  </div>
                  <div>
                    <label className={labelClass}>বিভাগ</label>
                    <select
                      value={sameAddress ? permDivId : currDivId}
                      onChange={(e) => {
                        setCurrDivId(e.target.value);
                        setCurrDistId("");
                        setCurrThanaId("");
                        const div = divisions.find((d) => String(d.id) === e.target.value);
                        setForm({ ...form, currentDivision: div?.division || "", currentDistrict: "", currentThana: "" });
                      }}
                      className={inputClass}
                      disabled={sameAddress}
                    >
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>{d.division}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className={labelClass}>জেলা</label>
                      <select
                        value={sameAddress ? permDistId : currDistId}
                        onChange={(e) => {
                          setCurrDistId(e.target.value);
                          setCurrThanaId("");
                          const dist = currDistricts.find((d) => String(d.desId) === e.target.value);
                          setForm({ ...form, currentDistrict: dist?.district || "", currentThana: "" });
                        }}
                        className={inputClass}
                        disabled={sameAddress || !(sameAddress ? permDivId : currDivId)}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {(sameAddress ? permDistricts : currDistricts).map((d) => (
                          <option key={d.desId} value={d.desId}>{d.district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>থানা</label>
                      <select
                        value={sameAddress ? permThanaId : currThanaId}
                        onChange={(e) => {
                          setCurrThanaId(e.target.value);
                          const th = currThanas.find((t) => String(t.id) === e.target.value);
                          setForm({ ...form, currentThana: th?.thana || "" });
                        }}
                        className={inputClass}
                        disabled={sameAddress || !(sameAddress ? permDistId : currDistId)}
                      >
                        <option value="">থানা নির্বাচন করুন</option>
                        {(sameAddress ? permThanas : currThanas).map((t) => (
                          <option key={t.id} value={t.id}>{t.thana}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className={labelClass}>ঠিকানার বিস্তারিত</label>
                    <textarea
                      rows={2}
                      value={sameAddress ? form.permanentAddressDetails : form.currentAddressDetails}
                      onChange={(e) => setForm({ ...form, currentAddressDetails: e.target.value })}
                      className={inputClass}
                      disabled={sameAddress}
                      placeholder="গ্রাম / রাস্তা / বাসা নম্বর ইত্যাদি"
                    />
                  </div>
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
