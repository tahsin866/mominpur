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

  const [transactionId, setTransactionId] = useState("");

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
    fetch(`/api/location/divisions`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load divisions");
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }
        return r.json();
      })
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

  const isValidBdPhone = (value: string) =>
    /^01[3-9]\d{8}$/.test(value);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d{0,11}$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
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

    if (!isValidBdPhone(form.phone)) {
      setMessage("Error: সঠিক মোবাইল নম্বর দিন (013, 014, 015, 016, 017, 018, 019 দিয়ে শুরু হতে হবে এবং ১১ ডিজিটের হতে হবে)।");
      setLoading(false);
      return;
    }
    if (!isValidBdPhone(form.whatsapp)) {
      setMessage("Error: সঠিক হোয়াটসঅ্যাপ নম্বর দিন (013, 014, 015, 016, 017, 018, 019 দিয়ে শুরু হতে হবে এবং ১১ ডিজিটের হতে হবে)।");
      setLoading(false);
      return;
    }
    if (!transactionId.trim()) {
      setMessage("Error: ট্রানজেকশন আইডি আবশ্যক।");
      setLoading(false);
      return;
    }

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
        permThanas.find((t) => String(t.id) === permThanaId)?.thana || "",
      currentDivision:
        curDivisions.find((d) => String(d.id) === curDivId)?.division || "",
      currentDistrict:
        curDistricts.find((d) => String(d.desId) === curDistId)?.district || "",
      currentThana:
        curThanas.find((t) => String(t.id) === curThanaId)?.thana || "",
    };

    try {
      const res = await fetch(
        `/api/registrations/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok && data.id) {
        // Submit transaction with registration ID
        await fetch("/api/transactions/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: data.id,
            transactionId: transactionId.trim(),
            payingNumber: "0170000000000",
          }),
        });
        setMessage("আলহামদুলিল্লাহ! আপনার ফরমটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে।");
        setSelectedDepartments([]);
        setSelectedOccupations([]);
        setTransactionId("");
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
      } else {
        setMessage("Error: " + (data.message || "সমস্যা হয়েছে"));
      }
    } catch {
      setMessage("Error: সার্ভারে সংযোগ করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full text-lg px-3 py-2 border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased" style={{ backgroundColor: "#FFFFFF", color: "#064E3B" }}>
      <header className="py-6 px-4 text-white" style={{ backgroundColor: "#0A3D2A" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">মিলনমেলা রেজিস্ট্রেশন</h1>
          <Link
            href="/"
            className="text-lg hover:text-white transition"
            style={{ color: "#C9BFA6" }}
          >
            ← হোম পেজে ফিরুন
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <div className="p-6 md:p-10" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: "#064E3B" }}>
              মিলনমেলা রেজিস্ট্রেশন ফর্ম
            </h2>
            <p className="text-lg mt-1" style={{ color: "#6B7280" }}>
              সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন।
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-3 rounded-sm text-lg font-medium ${
                message.startsWith("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 1. Basic Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                মৌলিক তথ্য
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    maxLength={11}
                    pattern="\d{11}"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    হোয়াটসঅ্যাপ নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                    maxLength={11}
                    pattern="\d{11}"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Study Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                মাদরাসায় অধ্যয়নের বিবরণ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    বিভাগ/জামাত *
                  </label>
                  <div ref={deptRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDeptOpen((o) => !o)}
                      className={`w-full text-lg px-3 py-2 border rounded-sm bg-white text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        deptOpen
                          ? "border-emerald-500 ring-1 ring-emerald-500"
                          : ""
                      }`}
                    >
                      <span className="truncate">
                        {selectedDepartments.length > 0
                          ? selectedDepartments.join(", ")
                          : "নির্বাচন করুন"}
                      </span>
                      <svg
                         className={`w-4 h-4 ml-2 shrink-0 transition-transform ${
                           deptOpen ? "rotate-180" : ""
                         }`}
                         style={{ color: "#6B7280" }}
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
                       <div className="absolute z-50 mt-1 w-full bg-white border rounded-sm shadow-lg" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
                        {["নাজেরা", "হিফজ", "কিতাব"].map((dept) => (
                           <label
                             key={dept}
                             className="flex items-center gap-2 px-3 py-2 text-lg cursor-pointer transition"
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
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                স্থায়ী ঠিকানা
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                        {t.thana}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                বর্তমান ঠিকানা
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
                        {t.thana}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
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
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                পেশার বিবরণ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    পেশা *
                  </label>
                  <div ref={occRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setOccOpen((o) => !o)}
                      className={`w-full text-lg px-3 py-2 border rounded-sm bg-white text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        occOpen
                          ? "border-emerald-500 ring-1 ring-emerald-500"
                          : ""
                      }`}
                    >
                      <span className="truncate">
                        {selectedOccupations.length > 0
                          ? selectedOccupations.join(", ")
                          : "নির্বাচন করুন"}
                      </span>
                      <svg
                         className={`w-4 h-4 ml-2 shrink-0 transition-transform ${
                           occOpen ? "rotate-180" : ""
                         }`}
                         style={{ color: "#6B7280" }}
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
                       <div className="absolute z-50 mt-1 w-full bg-white border rounded-sm shadow-lg max-h-60 overflow-y-auto" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
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
                             className="flex items-center gap-2 px-3 py-2 text-lg cursor-pointer transition"
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
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    পেশার বিস্তারিত বিবরণ
                  </label>
                  <input
                    type="text"
                    name="occupationDetails"
                    value={form.occupationDetails}
                    onChange={handleChange}
                    placeholder="প্রতিষ্ঠানের নাম, পদবী, বিবরণ"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* 6. Payment */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                পেমেন্ট
              </h3>
              <div className="p-4 rounded-sm" style={{ backgroundColor: "#F0FDF4", border: "1px solid rgba(10,61,42,0.15)" }}>
                <p className="text-lg font-semibold mb-2" style={{ color: "#064E3B" }}>
                  নগদ/বিকাশ/রকেট পেমেন্ট করুন
                </p>
                <p className="text-lg mb-1" style={{ color: "#6B7280" }}>
                  পেয়িং নম্বর:
                </p>
                <p className="text-2xl font-bold mb-4" style={{ color: "#0A3D2A", fontFamily: "var(--font-display)" }}>
                  0170000000000
                </p>
                <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                  পেমেন্ট করার পর নিচে ট্রানজেকশন আইডি দিন।
                </p>
                <div>
                  <label className="block text-lg font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    ট্রানজেকশন আইডি *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="ট্রানজেকশন আইডি লিখুন"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link
                href="/"
                className="text-lg font-semibold py-2 px-5 rounded-sm transition"
                style={{ color: "#064E3B", backgroundColor: "#F3F4F6" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
              >
                বাতিল করুন
              </Link>
              <button
                type="submit"
                disabled={loading || selectedDepartments.length === 0 || selectedOccupations.length === 0 || !transactionId.trim()}
                className="text-white text-lg font-semibold py-2 px-6 rounded-sm hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: "#0A3D2A" }}
              >
                {loading ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-lg" style={{ borderTop: "1px solid rgba(10,61,42,0.15)", backgroundColor: "#FFFFFF", color: "#6B7280" }}>
        <p>© ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
