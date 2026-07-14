"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

export default function RegistrationPage() {
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [permDivId, setPermDivId] = useState("");
  const [permDistId, setPermDistId] = useState("");
  const [permThanaId, setPermThanaId] = useState("");

  const [curDivId, setCurDivId] = useState("");
  const [curDistId, setCurDistId] = useState("");
  const [curThanaId, setCurThanaId] = useState("");

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([]);

  const [deptOpen, setDeptOpen] = useState(false);
  const [occOpen, setOccOpen] = useState(false);
  const deptRef = useRef<HTMLDivElement>(null);
  const occRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    phone: "",
    whatsapp: "",
    studyFrom: "",
    studyTo: "",
    permanentAddressDetails: "",
    currentAddressDetails: "",
    occupationDetails: "",
  });

  const startYear = 1963;
  const currentYear = 2026;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/location/divisions`)
      .then((res) => res.json())
      .then((data) => setDivisions(data))
      .catch((err) => console.error("Failed to load divisions", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptOpen(false);
      }
      if (occRef.current && !occRef.current.contains(e.target as Node)) {
        setOccOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const permDivisions = divisions;
  const permDistricts =
    permDivisions.find((d) => String(d.id) === permDivId)?.districts || [];
  const permThanas =
    permDistricts.find((d) => String(d.desId) === permDistId)?.thanas || [];

  const curDivisions = divisions;
  const curDistricts =
    curDivisions.find((d) => String(d.id) === curDivId)?.districts || [];
  const curThanas =
    curDistricts.find((d) => String(d.desId) === curDistId)?.thanas || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      departments: selectedDepartments.join(", "),
      occupation: selectedOccupations.join(", "),
      permanentDivision:
        permDivisions.find((d) => String(d.id) === permDivId)?.division || "",
      permanentDistrict:
        permDistricts.find((d) => String(d.desId) === permDistId)?.district ||
        "",
      permanentThana:
        permThanas.find((t) => String(t.id) === permThanaId)?.thanaName || "",
      currentDivision:
        curDivisions.find((d) => String(d.id) === curDivId)?.division || "",
      currentDistrict:
        curDistricts.find((d) => String(d.desId) === curDistId)?.district || "",
      currentThana:
        curThanas.find((t) => String(t.id) === curThanaId)?.thanaName || "",
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const text = await res.text();
      setMessage(res.ok ? text : "Error: " + text);
      if (res.ok) {
        setSelectedDepartments([]);
        setSelectedOccupations([]);
        setForm({
          name: "",
          fatherName: "",
          phone: "",
          whatsapp: "",
          studyFrom: "",
          studyTo: "",
          permanentAddressDetails: "",
          currentAddressDetails: "",
          occupationDetails: "",
        });
        setPermDivId("");
        setPermDistId("");
        setPermThanaId("");
        setCurDivId("");
        setCurDistId("");
        setCurThanaId("");
      }
    } catch {
      setMessage("Error: সার্ভারে সংযোগ করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full text-lg px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800";

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      <header className="bg-emerald-800 dark:bg-emerald-950 py-6 px-4 text-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">মিলনমেলা রেজিস্ট্রেশন</h1>
          <Link
            href="/"
            className="text-lg text-emerald-200 hover:text-white transition"
          >
            ← হোম পেজে ফিরুন
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <div className="bg-white rounded-sm border border-zinc-200/80 shadow-sm p-6 md:p-10 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              মিলনমেলা রেজিস্ট্রেশন ফর্ম
            </h2>
            <p className="text-lg text-zinc-500 mt-1 dark:text-zinc-400">
              সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন।
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-3 rounded-sm text-lg font-medium ${
                message.startsWith("Error")
                  ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 1. Basic Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 border-b border-zinc-100 pb-1 dark:border-zinc-800">
                মৌলিক তথ্য
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="আপনার নাম"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    পিতার নাম *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                    placeholder="পিতার নাম"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    হোয়াটসঅ্যাপ নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Study Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 border-b border-zinc-100 pb-1 dark:border-zinc-800">
                মাদরাসায় অধ্যয়নের বিবরণ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    অধ্যয়ন শুরু *
                  </label>
                  <select
                    name="studyFrom"
                    value={form.studyFrom}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">শুরুর বছর</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    অধ্যয়ন শেষ *
                  </label>
                  <select
                    name="studyTo"
                    value={form.studyTo}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">শেষের বছর</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    বিভাগ/জামাত *
                  </label>
                  <div ref={deptRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDeptOpen((o) => !o)}
                      className={`w-full text-lg px-3 py-2 border rounded-sm bg-zinc-50/50 text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 ${
                        deptOpen
                          ? "border-emerald-500 ring-1 ring-emerald-500"
                          : "border-zinc-300"
                      }`}
                    >
                      <span className="truncate">
                        {selectedDepartments.length > 0
                          ? selectedDepartments.join(", ")
                          : "নির্বাচন করুন"}
                      </span>
                      <svg
                        className={`w-4 h-4 ml-2 shrink-0 text-zinc-400 transition-transform ${
                          deptOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {deptOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-sm shadow-lg dark:bg-zinc-800 dark:border-zinc-700">
                        {["তাহফিজুলরান", "কিতাব", "নূরানী"].map((dept) => (
                          <label
                            key={dept}
                            className="flex items-center gap-2 px-3 py-2 text-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-zinc-700 transition"
                          >
                            <input
                              type="checkbox"
                              className="accent-emerald-600"
                              checked={selectedDepartments.includes(dept)}
                              onChange={() =>
                                setSelectedDepartments((prev) =>
                                  prev.includes(dept)
                                    ? prev.filter((d) => d !== dept)
                                    : [...prev, dept]
                                )
                              }
                            />
                            {dept}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Permanent Address */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 border-b border-zinc-100 pb-1 dark:border-zinc-800">
                স্থায়ী ঠিকানা
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    বিভাগ
                  </label>
                  <select
                    value={permDivId}
                    onChange={(e) => {
                      setPermDivId(e.target.value);
                      setPermDistId("");
                      setPermThanaId("");
                    }}
                    className={inputClass}
                  >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {permDivisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.division}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    জেলা
                  </label>
                  <select
                    value={permDistId}
                    onChange={(e) => {
                      setPermDistId(e.target.value);
                      setPermThanaId("");
                    }}
                    className={inputClass}
                    disabled={!permDivId}
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {permDistricts.map((d) => (
                      <option key={d.desId} value={d.desId}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    থানা
                  </label>
                  <select
                    value={permThanaId}
                    onChange={(e) => setPermThanaId(e.target.value)}
                    className={inputClass}
                    disabled={!permDistId}
                  >
                    <option value="">থানা নির্বাচন করুন</option>
                    {permThanas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.thanaName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                  গ্রাম/ঠিকানার বিস্তারিত
                </label>
                <textarea
                  name="permanentAddressDetails"
                  value={form.permanentAddressDetails}
                  onChange={handleChange}
                  rows={2}
                  placeholder="গ্রাম, ডাকঘর ইত্যাদি..."
                  className={inputClass}
                ></textarea>
              </div>
            </div>

            {/* 4. Current Address */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 border-b border-zinc-100 pb-1 dark:border-zinc-800">
                বর্তমান ঠিকানা
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    বিভাগ
                  </label>
                  <select
                    value={curDivId}
                    onChange={(e) => {
                      setCurDivId(e.target.value);
                      setCurDistId("");
                      setCurThanaId("");
                    }}
                    className={inputClass}
                  >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {curDivisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.division}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    জেলা
                  </label>
                  <select
                    value={curDistId}
                    onChange={(e) => {
                      setCurDistId(e.target.value);
                      setCurThanaId("");
                    }}
                    className={inputClass}
                    disabled={!curDivId}
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {curDistricts.map((d) => (
                      <option key={d.desId} value={d.desId}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    থানা
                  </label>
                  <select
                    value={curThanaId}
                    onChange={(e) => setCurThanaId(e.target.value)}
                    className={inputClass}
                    disabled={!curDistId}
                  >
                    <option value="">থানা নির্বাচন করুন</option>
                    {curThanas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.thanaName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                  বর্তমান ঠিকানার বিস্তারিত
                </label>
                <textarea
                  name="currentAddressDetails"
                  value={form.currentAddressDetails}
                  onChange={handleChange}
                  rows={2}
                  placeholder="বাসা নম্বর, রোড, এলাকা ইত্যাদি..."
                  className={inputClass}
                ></textarea>
              </div>
            </div>

            {/* 5. Occupation & Security */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 border-b border-zinc-100 pb-1 dark:border-zinc-800">
                পেশা ও একাউন্ট সিকিউরিটি
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    পেশা *
                  </label>
                  <div ref={occRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setOccOpen((o) => !o)}
                      className={`w-full text-lg px-3 py-2 border rounded-sm bg-zinc-50/50 text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 ${
                        occOpen
                          ? "border-emerald-500 ring-1 ring-emerald-500"
                          : "border-zinc-300"
                      }`}
                    >
                      <span className="truncate">
                        {selectedOccupations.length > 0
                          ? selectedOccupations.join(", ")
                          : "নির্বাচন করুন"}
                      </span>
                      <svg
                        className={`w-4 h-4 ml-2 shrink-0 text-zinc-400 transition-transform ${
                          occOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {occOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-sm shadow-lg max-h-60 overflow-y-auto dark:bg-zinc-800 dark:border-zinc-700">
                        {[
                          "শিক্ষক",
                          "ব্যবসায়ী",
                          "চিকিৎসক",
                          "ইঞ্জিনিয়ার",
                          "আইনজীবী",
                          "কৃষক",
                          "সরকারি চাকুরি",
                          "বেসরকারি চাকুরি",
                          "অন্যান্য",
                        ].map((job) => (
                          <label
                            key={job}
                            className="flex items-center gap-2 px-3 py-2 text-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-zinc-700 transition"
                          >
                            <input
                              type="checkbox"
                              className="accent-emerald-600"
                              checked={selectedOccupations.includes(job)}
                              onChange={() =>
                                setSelectedOccupations((prev) =>
                                  prev.includes(job)
                                    ? prev.filter((j) => j !== job)
                                    : [...prev, job]
                                )
                              }
                            />
                            {job}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider text-zinc-600 mb-1 dark:text-zinc-400">
                    পেশার বিস্তারিত বিবরণ
                  </label>
                  <input
                    type="text"
                    name="occupationDetails"
                    value={form.occupationDetails}
                    onChange={handleChange}
                    placeholder="প্রতিষ্ঠানের নাম বা পদবী"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link
                href="/"
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-lg font-semibold py-2 px-5 rounded-sm transition dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                বাতিল করুন
              </Link>
              <button
                type="submit"
                disabled={loading || selectedDepartments.length === 0 || selectedOccupations.length === 0}
                className="bg-emerald-600 text-white text-lg font-semibold py-2 px-6 rounded-sm hover:bg-emerald-700 transition dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50"
              >
                {loading ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-lg text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p>© ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
