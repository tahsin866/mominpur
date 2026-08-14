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
  const [divisionsLoading, setDivisionsLoading] = useState(true);
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
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [receiverNumber, setReceiverNumber] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  // অতিথি — ০, ১ বা ২ জন। টাকার চূড়ান্ত হিসাব সার্ভারেই হয়, এখানে শুধু দেখানো।
  const [guestCount, setGuestCount] = useState(0);

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
    bloodGroup: "",
  });

  // ব্যাকএন্ডের FeeCalculator.java-র সাথে মিল রাখতে হবে।
  const REGISTRATION_FEE = 1020;
  const GUEST_FEE = 510;
  const MAX_GUESTS = 2;

  const guestTotal = guestCount * GUEST_FEE;
  const grandTotal = REGISTRATION_FEE + guestTotal;

  // "2,040" → "২,০৪০"। লোকেল স্পষ্ট করে দেওয়া, নইলে সার্ভার-ক্লায়েন্টে আলাদা হতে পারে।
  const bn = (n: number) =>
    n.toLocaleString("en-US").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

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
      .catch((err) => console.error("Failed to load divisions", err))
      .finally(() => setDivisionsLoading(false));
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

  const [errorField, setErrorField] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  const showError = (msg: string, fieldId: string) => {
    setMessage("Error: " + msg);
    setErrorField(fieldId);
    setLoading(false);
    setTimeout(() => {
      document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorField("");

    if (form.studyFrom && form.studyTo && Number(form.studyTo) < Number(form.studyFrom)) {
      showError("অধ্যয়ন শেষের বছর অবশ্যই অধ্যয়ন শুরুর বছরের সমান বা পরে হতে হবে। আপনি শুরু দিয়েছেন " + form.studyFrom + " আর শেষ দিয়েছেন " + form.studyTo + " — দয়া করে সঠিক তথ্য দিন।", "field-studyTo");
      return;
    }

    if (!isValidBdPhone(form.phone)) {
      showError("সঠিক মোবাইল নম্বর দিন (013, 014, 015, 016, 017, 018, 019 দিয়ে শুরু হতে হবে এবং ১১ ডিজিটের হতে হবে)।", "field-phone");
      return;
    }
    if (!isValidBdPhone(form.whatsapp)) {
      showError("সঠিক হোয়াটসঅ্যাপ নম্বর দিন (013, 014, 015, 016, 017, 018, 019 দিয়ে শুরু হতে হবে এবং ১১ ডিজিটের হতে হবে)।", "field-whatsapp");
      return;
    }
    if (!receiverNumber) {
      showError("যে নম্বরে সেন্ডমানি করেছেন তা নির্বাচন করুন।", "field-receiverNumber");
      return;
    }
    if (!paidAmount || Number(paidAmount) <= 0) {
      showError("কত টাকা পাঠিয়েছেন তা লিখুন।", "field-paidAmount");
      return;
    }
    if (!transactionId.trim()) {
      showError("ট্রানজেকশন আইডি আবশ্যক।", "field-transactionId");
      return;
    }
    if (!lastFourDigits.trim() || lastFourDigits.length !== 4) {
      showError("পেয়িং নম্বরের শেষ ৪ ডিজিট আবশ্যক।", "field-lastFourDigits");
      return;
    }

    const payload = {
      ...form,
      ...(sameAddress ? { currentAddressDetails: form.permanentAddressDetails } : {}),
      guestCount,
      departments: selectedDepartments.join(", "),
      occupation: selectedOccupations.join(", "),
      permanentDivision:
        permDivisions.find((d) => String(d.id) === permDivId)?.division || "",
      permanentDistrict:
        permDistricts.find((d) => String(d.desId) === permDistId)?.district ||
        "",
      permanentThana:
        permThanas.find((t) => String(t.id) === permThanaId)?.thana || "",
      currentDivision: sameAddress
        ? permDivisions.find((d) => String(d.id) === permDivId)?.division || ""
        : curDivisions.find((d) => String(d.id) === curDivId)?.division || "",
      currentDistrict: sameAddress
        ? permDistricts.find((d) => String(d.desId) === permDistId)?.district || ""
        : curDistricts.find((d) => String(d.desId) === curDistId)?.district || "",
      currentThana: sameAddress
        ? permThanas.find((t) => String(t.id) === permThanaId)?.thana || ""
        : curThanas.find((t) => String(t.id) === curThanaId)?.thana || "",
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
      let data: string | Record<string, unknown>;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      // Duplicate check — backend returns 400 with DUPLICATE_PHONE or DUPLICATE_WHATSAPP prefix
      if (!res.ok && typeof data === "string") {
        if (data.includes("DUPLICATE_PHONE")) {
          showError(data.replace("DUPLICATE_PHONE: ", ""), "field-phone");
          return;
        }
        if (data.includes("DUPLICATE_WHATSAPP")) {
          showError(data.replace("DUPLICATE_WHATSAPP: ", ""), "field-whatsapp");
          return;
        }
        showError(data || "সমস্যা হয়েছে", "form-message");
        setTimeout(() => {
          document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }

      if (res.ok && typeof data === "object" && data !== null && "id" in data) {
        // Submit transaction with registration ID
        await fetch("/api/transactions/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: data.id,
            transactionId: transactionId.trim(),
            payingNumber: lastFourDigits.trim(),
            receiverNumber: receiverNumber,
            paidAmount: Number(paidAmount),
          }),
        });
        setMessage("আলহামদুলিল্লাহ! আপনার ফরমটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে।");
        setTimeout(() => {
          document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        setSelectedDepartments([]);
        setSelectedOccupations([]);
        setTransactionId("");
        setLastFourDigits("");
        setReceiverNumber("");
        setPaidAmount("");
        setGuestCount(0);
        setSameAddress(false);
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
          bloodGroup: "",
        });
        setPermDivId("");
        setPermDistId("");
        setPermThanaId("");
        setCurDivId("");
        setCurDistId("");
        setCurThanaId("");
      } else {
        const errMsg = typeof data === "string" ? data : ((data as Record<string, unknown>)?.message as string || "সমস্যা হয়েছে");
        setMessage("Error: " + errMsg);
        setTimeout(() => {
          document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "সার্ভারে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন।";
      setMessage("Error: " + msg);
      setTimeout(() => {
        document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldId?: string) =>
    "w-full text-base px-3 py-2 border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" +
    (fieldId && errorField === fieldId ? " border-red-500 bg-red-50 ring-1 ring-red-500" : "");

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased" style={{ backgroundColor: "#FFFFFF", color: "#064E3B" }}>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <div className="p-4 sm:p-6 md:p-10" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
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
              id="form-message"
              className={`mb-6 p-3 rounded-sm text-lg font-medium ${message.startsWith("Error")
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="আপনার নাম"
                    className={inputClass()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    পিতার নাম *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                    placeholder="পিতার নাম"
                    className={inputClass()}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    মোবাইল নম্বর *
                  </label>
                  <input
                    id="field-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass("field-phone")}
                    maxLength={11}
                    pattern="\d{11}"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    হোয়াটসঅ্যাপ নম্বর *
                  </label>
                  <input
                    id="field-whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass("field-whatsapp")}
                    maxLength={11}
                    pattern="\d{11}"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    ব্লাড গ্রুপ
                  </label>
                  <select
                    id="field-bloodGroup"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className={inputClass("field-bloodGroup")}
                  >
                    <option value="">ব্লাড গ্রুপ নির্বাচন করুন</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    অধ্যয়ন শুরু *
                  </label>
                  <select
                    name="studyFrom"
                    value={form.studyFrom}
                    onChange={handleChange}
                    className={inputClass()}
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    অধ্যয়ন শেষ *
                  </label>
                  <select
                    id="field-studyTo"
                    name="studyTo"
                    value={form.studyTo}
                    onChange={handleChange}
                    className={inputClass("field-studyTo")}
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    বিভাগ/জামাত *
                  </label>
                  <div ref={deptRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDeptOpen((o) => !o)}
                      className={`w-full text-base px-3 py-2 border rounded-sm bg-white text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500 ${deptOpen
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
                        className={`w-4 h-4 ml-2 shrink-0 transition-transform ${deptOpen ? "rotate-180" : ""
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
                            className="flex items-center gap-2 px-3 py-2 text-base cursor-pointer transition"
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    বিভাগ *
                  </label>
                  <select
                    value={permDivId}
                    onChange={(e) => {
                      setPermDivId(e.target.value);
                      setPermDistId("");
                      setPermThanaId("");
                    }}
                    className={inputClass()}
                    required
                  >
                    <option value="">{divisionsLoading ? "লোড হচ্ছে..." : "বিভাগ নির্বাচন করুন"}</option>
                    {permDivisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.division}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    জেলা *
                  </label>
                  <select
                    value={permDistId}
                    onChange={(e) => {
                      setPermDistId(e.target.value);
                      setPermThanaId("");
                    }}
                    className={inputClass()}
                    disabled={!permDivId}
                    required
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    থানা *
                  </label>
                  <select
                    value={permThanaId}
                    onChange={(e) => setPermThanaId(e.target.value)}
                    className={inputClass()}
                    disabled={!permDistId}
                    required
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
                <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                  গ্রাম/ঠিকানার বিস্তারিত *
                </label>
                <textarea
                  name="permanentAddressDetails"
                  value={form.permanentAddressDetails}
                  onChange={handleChange}
                  rows={2}
                  placeholder="গ্রাম, ডাকঘর ইত্যাদি..."
                  className={inputClass()}
                  required
                ></textarea>
              </div>
            </div>

            {/* 4. Current Address */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
                <h3 className="text-lg font-bold" style={{ color: "#0A3D2A" }}>
                  বর্তমান ঠিকানা
                </h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSameAddress(checked);
                      if (checked) {
                        setCurDivId(permDivId);
                        setCurDistId(permDistId);
                        setCurThanaId(permThanaId);
                        setForm((prev) => ({
                          ...prev,
                          currentAddressDetails: prev.permanentAddressDetails,
                        }));
                      } else {
                        setCurDivId("");
                        setCurDistId("");
                        setCurThanaId("");
                        setForm((prev) => ({
                          ...prev,
                          currentAddressDetails: "",
                        }));
                      }
                    }}
                    className="w-4 h-4 accent-emerald-700 rounded"
                  />
                  <span className="text-sm font-medium" style={{ color: "#064E3B" }}>
                    স্থায়ী ঠিকানার সাথে একই
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    বিভাগ *
                  </label>
                  <select
                    value={sameAddress ? permDivId : curDivId}
                    onChange={(e) => {
                      setCurDivId(e.target.value);
                      setCurDistId("");
                      setCurThanaId("");
                    }}
                    className={inputClass()}
                    disabled={sameAddress}
                    required
                  >
                    <option value="">{divisionsLoading ? "লোড হচ্ছে..." : "বিভাগ নির্বাচন করুন"}</option>
                    {curDivisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.division}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    জেলা *
                  </label>
                  <select
                    value={sameAddress ? permDistId : curDistId}
                    onChange={(e) => {
                      setCurDistId(e.target.value);
                      setCurThanaId("");
                    }}
                    className={inputClass()}
                    disabled={sameAddress || !(sameAddress ? permDivId : curDivId)}
                    required
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {(sameAddress ? permDistricts : curDistricts).map((d) => (
                      <option key={d.desId} value={d.desId}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    থানা *
                  </label>
                  <select
                    value={sameAddress ? permThanaId : curThanaId}
                    onChange={(e) => setCurThanaId(e.target.value)}
                    className={inputClass()}
                    disabled={sameAddress || !(sameAddress ? permDistId : curDistId)}
                    required
                  >
                    <option value="">থানা নির্বাচন করুন</option>
                    {(sameAddress ? permThanas : curThanas).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.thana}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                  বর্তমান ঠিকানার বিস্তারিত *
                </label>
                <textarea
                  name="currentAddressDetails"
                  value={sameAddress ? form.permanentAddressDetails : form.currentAddressDetails}
                  onChange={handleChange}
                  rows={2}
                  placeholder="বাসা নম্বর, রোড, এলাকা ইত্যাদি..."
                  className={inputClass()}
                  disabled={sameAddress}
                  required
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    পেশা *
                  </label>
                  <div ref={occRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setOccOpen((o) => !o)}
                      className={`w-full text-base px-3 py-2 border rounded-sm bg-white text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-emerald-500 ${occOpen
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
                        className={`w-4 h-4 ml-2 shrink-0 transition-transform ${occOpen ? "rotate-180" : ""
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
                            className="flex items-center gap-2 px-3 py-2 text-base cursor-pointer transition"
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
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    পেশার বিস্তারিত বিবরণ
                  </label>
                  <input
                    type="text"
                    name="occupationDetails"
                    value={form.occupationDetails}
                    onChange={handleChange}
                    placeholder="প্রতিষ্ঠানের নাম, পদবী, বিবরণ"
                    className={inputClass()}
                  />
                </div>
              </div>
            </div>

            {/* 6. Payment */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                সেন্ডমানি করুন
              </h3>
              <div className="p-4 rounded-sm" style={{ backgroundColor: "#F0FDF4", border: "1px solid rgba(10,61,42,0.15)" }}>
                {/* অতিথি নির্বাচন */}
                <div className="mb-4 p-3 rounded-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
                  <p className="text-lg font-semibold mb-1" style={{ color: "#064E3B" }}>
                    আপনার সাথে কতজন অতিথি আসবেন?
                  </p>
                  <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
                    সর্বোচ্চ {bn(MAX_GUESTS)} জন। প্রতি অতিথির ফি {bn(GUEST_FEE)} টাকা।
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {Array.from({ length: MAX_GUESTS + 1 }, (_, count) => {
                      const selected = guestCount === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setGuestCount(count)}
                          aria-pressed={selected}
                          className="py-2 px-2 rounded-sm text-center transition"
                          style={{
                            backgroundColor: selected ? "#0A3D2A" : "#FFFFFF",
                            color: selected ? "#FFFFFF" : "#064E3B",
                            border: selected
                              ? "2px solid #0A3D2A"
                              : "1px solid rgba(10,61,42,0.25)",
                          }}
                        >
                          <span className="block text-lg font-semibold">
                            {count === 0 ? "অতিথি নেই" : `${bn(count)} জন`}
                          </span>
                          <span
                            className="block text-sm"
                            style={{ color: selected ? "#C9BFA6" : "#6B7280" }}
                          >
                            {count === 0 ? "০ টাকা" : `${bn(count * GUEST_FEE)} টাকা`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* টাকার হিসাব */}
                <div className="mb-4 p-3 rounded-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-lg" style={{ color: "#6B7280" }}>রেজিস্ট্রেশন ফি</span>
                    <span className="text-lg font-semibold" style={{ color: "#064E3B" }}>
                      {bn(REGISTRATION_FEE)} টাকা
                    </span>
                  </div>

                  {guestCount > 0 && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-lg" style={{ color: "#6B7280" }}>
                        অতিথি ({bn(guestCount)} × {bn(GUEST_FEE)})
                      </span>
                      <span className="text-lg font-semibold" style={{ color: "#064E3B" }}>
                        {bn(guestTotal)} টাকা
                      </span>
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-2 pt-3"
                    style={{ borderTop: "1px solid rgba(10,61,42,0.15)" }}
                  >
                    <span className="text-lg font-semibold" style={{ color: "#064E3B" }}>সর্বমোট</span>
                    <span className="text-2xl font-bold" style={{ color: "#0A3D2A" }}>
                      {bn(grandTotal)} টাকা
                    </span>
                  </div>
                </div>

                <p className="text-lg font-semibold mb-3" style={{ color: "#064E3B" }}>
                  বিকাশে সর্বমোট <span style={{ color: "#0A3D2A" }}>{bn(grandTotal)} টাকা</span> সেন্ডমানি করুন
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base" style={{ color: "#6B7280" }}>নম্বর ১:</span>
                    <span className="text-base sm:text-lg font-bold" style={{ color: "#0A3D2A" }}>01775900779</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base" style={{ color: "#6B7280" }}>নম্বর ২:</span>
                    <span className="text-base sm:text-lg font-bold" style={{ color: "#0A3D2A" }}>01727728792</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      যে নম্বরে সেন্ডমানি করেছেন *
                    </label>
                    <select
                      id="field-receiverNumber"
                      value={receiverNumber}
                      onChange={(e) => setReceiverNumber(e.target.value)}
                      className={inputClass("field-receiverNumber")}
                      required
                    >
                      <option value="">নম্বর নির্বাচন করুন</option>
                      <option value="01775900779">01775900779</option>
                      <option value="01727728792">01727728792</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      কত টাকা পাঠিয়েছেন *
                    </label>
                    <input
                      id="field-paidAmount"
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      placeholder="টাকার পরিমাণ"
                      className={inputClass("field-paidAmount")}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      যে নাম্বার থেকে সেন্ডমানি করেছেন তার ট্রানজেকশন আইডি *
                    </label>
                    <input
                      id="field-transactionId"
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="ট্রানজেকশন আইডি লিখুন"
                      className={inputClass("field-transactionId")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      যে  নম্বরের থেকে সেন্ডমানি করেছেন তার শেষ ৪ ডিজিট *
                    </label>
                    <input
                      id="field-lastFourDigits"
                      type="text"
                      value={lastFourDigits}
                      className={inputClass("field-lastFourDigits")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d{0,4}$/.test(val)) {
                          setLastFourDigits(val);
                        }
                      }}
                      placeholder="৪ ডিজিট"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Link
                href="/"
                className="text-base font-semibold py-2.5 px-5 rounded-sm transition text-center"
                style={{ color: "#064E3B", backgroundColor: "#F3F4F6" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
              >
                বাতিল করুন
              </Link>
              <button
                type="submit"
                disabled={loading || selectedDepartments.length === 0 || selectedOccupations.length === 0 || !transactionId.trim() || lastFourDigits.length !== 4}
                className="text-white text-base font-semibold py-2.5 px-6 rounded-sm hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: "#0A3D2A" }}
              >
                {loading ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm sm:text-base" style={{ borderTop: "1px solid rgba(10,61,42,0.15)", backgroundColor: "#FFFFFF", color: "#6B7280" }}>
        <p>© ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
