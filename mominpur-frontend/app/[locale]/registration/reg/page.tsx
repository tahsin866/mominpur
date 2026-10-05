"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { apiHeaders } from "@/lib/i18n/api";
import { locationEn } from "@/lib/i18n/location-en";
import { LocalizedText } from "@/lib/i18n/LocalizedText";

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
  const { t, num, fmt, href, locale } = useLang();

  // API e kono English field nai, tai label frontend-e map kora.
// Bangla page e original Bangla naam-i dekha hobe.
  const loc = (level: "division" | "district" | "thana", bn: string) =>
    locale === "en" ? locationEn(level, bn) : bn;
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


  const startYear = 1963;
  const currentYear = 2026;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    fetch(`/api/location/divisions`, { headers: apiHeaders(locale) })
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d*$/.test(value)) {
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

  // State holds the Bangla values (those go to the backend untouched).
  // Display uses the translated labels so the button is never Bangla on /en.
  const deptLabels = t.registration.departments
    .filter((d) => selectedDepartments.includes(d.value))
    .map((d) => d.label);
  const occLabels = t.registration.occupations
    .filter((o) => selectedOccupations.includes(o.value))
    .map((o) => o.label);

  const [errorField, setErrorField] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [foreignCountry, setForeignCountry] = useState("");
  const [foreignAddressDetails, setForeignAddressDetails] = useState("");

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
      showError(fmt(t.registration.errStudyRange, { from: form.studyFrom, to: form.studyTo }), "field-studyTo");
      return;
    }

    if (!form.phone.trim()) {
      showError(t.registration.errPhoneRequired, "field-phone");
      return;
    }
    if (!form.whatsapp.trim()) {
      showError(t.registration.errWhatsappRequired, "field-whatsapp");
      return;
    }
    if (!receiverNumber) {
      showError(t.registration.errReceiverRequired, "field-receiverNumber");
      return;
    }
    if (!paidAmount || Number(paidAmount) <= 0) {
      showError(t.registration.errPaidAmountRequired, "field-paidAmount");
      return;
    }
    if (!transactionId.trim()) {
      showError(t.registration.errTransactionRequired, "field-transactionId");
      return;
    }
    if (!lastFourDigits.trim() || lastFourDigits.length !== 4) {
      showError(t.registration.errLastFourRequired, "field-lastFourDigits");
      return;
    }

    const payload = {
      ...form,
      ...(sameAddress ? { currentAddressDetails: form.permanentAddressDetails } : {}),
      guestCount,
      departments: selectedDepartments.join(", "),
      occupation: selectedOccupations.join(", "),
      permanentDivision: isForeign
        ? ""
        : permDivisions.find((d) => String(d.id) === permDivId)?.division || "",
      permanentDistrict: isForeign
        ? ""
        : permDistricts.find((d) => String(d.desId) === permDistId)?.district || "",
      permanentThana: isForeign
        ? ""
        : permThanas.find((t) => String(t.id) === permThanaId)?.thana || "",
      permanentAddressDetails: isForeign ? foreignAddressDetails : form.permanentAddressDetails,
      permanentCountry: isForeign ? foreignCountry : "",
      currentDivision: isForeign
        ? ""
        : sameAddress
          ? permDivisions.find((d) => String(d.id) === permDivId)?.division || ""
          : curDivisions.find((d) => String(d.id) === curDivId)?.division || "",
      currentDistrict: isForeign
        ? ""
        : sameAddress
          ? permDistricts.find((d) => String(d.desId) === permDistId)?.district || ""
          : curDistricts.find((d) => String(d.desId) === curDistId)?.district || "",
      currentThana: isForeign
        ? ""
        : sameAddress
          ? permThanas.find((t) => String(t.id) === permThanaId)?.thana || ""
          : curThanas.find((t) => String(t.id) === curThanaId)?.thana || "",
      currentAddressDetails: isForeign ? foreignAddressDetails : form.currentAddressDetails,
      currentCountry: isForeign ? foreignCountry : "",
    };

    try {
      const res = await fetch(
        `/api/registrations/submit`,
        {
          method: "POST",
          headers: { ...apiHeaders(locale), "Content-Type": "application/json" },
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
        showError(data || t.registration.errGeneric, "form-message");
        setTimeout(() => {
          document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }

      if (res.ok && typeof data === "object" && data !== null && "id" in data) {
        // Submit transaction with registration ID
        const txRes = await fetch("/api/transactions/submit", {
          method: "POST",
          headers: { ...apiHeaders(locale), "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: data.id,
            transactionId: transactionId.trim(),
            payingNumber: lastFourDigits.trim(),
            receiverNumber: receiverNumber,
            paidAmount: Number(paidAmount),
          }),
        });
        const txContentType = txRes.headers.get("content-type");
        let txData: string;
        if (txContentType && txContentType.includes("application/json")) {
          const json = await txRes.json();
          txData = typeof json === "string" ? json : (json?.message || t.registration.errTxSave);
        } else {
          txData = await txRes.text();
        }
        if (!txRes.ok) {
          showError(txData || t.registration.errTxSaveFailed, "field-transactionId");
          return;
        }
        setMessage(t.registration.success);
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
        setIsForeign(false);
        setForeignCountry("");
        setForeignAddressDetails("");
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
        const errMsg = typeof data === "string" ? data : ((data as Record<string, unknown>)?.message as string || t.registration.errGeneric);
        setMessage("Error: " + errMsg);
        setTimeout(() => {
          document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : t.registration.errNetwork;
      setMessage("Error: " + msg);
      setTimeout(() => {
        document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const COUNTRIES = [
    "Afghanistan", "Algeria", "Argentina", "Australia", "Bahrain", "Bangladesh", "Belgium",
    "Brazil", "Brunei", "Cambodia", "Canada", "China", "Cyprus", "Denmark",
    "Egypt", "Finland", "France", "Germany", "Ghana", "Greece", "Hungary",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Lebanon", "Libya", "Malaysia",
    "Maldives", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand",
    "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Philippines", "Poland",
    "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Somalia", "South Africa",
    "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey", "UAE",
    "Uganda", "United Kingdom", "United States", "Uzbekistan", "Vietnam", "Yemen",
  ];

  const inputClass = (fieldId?: string) =>
    "w-full text-base px-3 py-2 border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" +
    (fieldId && errorField === fieldId ? " border-red-500 bg-red-50 ring-1 ring-red-500" : "");

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased" style={{ backgroundColor: "#FFFFFF", color: "#064E3B" }}>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <div className="p-4 sm:p-6 md:p-10" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: "#064E3B" }}>
              {t.registration.title}
            </h2>
            <p className="text-lg mt-1" style={{ color: "#6B7280" }}>
              <LocalizedText text={t.registration.subtitle} />
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
                <LocalizedText text={t.registration.sectionBasic} />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelName} /> *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.registration.placeholderName}
                    className={inputClass()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelFatherName} /> *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                    placeholder={t.registration.placeholderFatherName}
                    className={inputClass()}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelPhone} /> *
                  </label>
                  <input
                    id="field-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass("field-phone")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelWhatsapp} /> *
                  </label>
                  <input
                    id="field-whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass("field-whatsapp")}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelBloodGroup} />
                  </label>
                  <select
                    id="field-bloodGroup"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className={inputClass("field-bloodGroup")}
                  >
                    <option value="">{t.registration.selectBloodGroup}</option>
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
                <LocalizedText text={t.registration.sectionStudy} />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelStudyFrom} /> *
                  </label>
                  <select
                    name="studyFrom"
                    value={form.studyFrom}
                    onChange={handleChange}
                    className={inputClass()}
                    required
                  >
                    <option value="">{t.registration.placeholderStudyFrom}</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelStudyTo} /> *
                  </label>
                  <select
                    id="field-studyTo"
                    name="studyTo"
                    value={form.studyTo}
                    onChange={handleChange}
                    className={inputClass("field-studyTo")}
                    required
                  >
                    <option value="">{t.registration.placeholderStudyTo}</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelDepartment} /> *
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
                        {deptLabels.length > 0
                          ? deptLabels.join(", ")
                          : t.registration.selectHere}
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
                        {t.registration.departments.map(({ value: dept, label }) => (
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
                            {label}
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
              <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
                <h3 className="text-lg font-bold" style={{ color: "#0A3D2A" }}>
                  <LocalizedText text={t.registration.sectionPermanentAddress} />
                </h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isForeign}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsForeign(checked);
                      if (checked) {
                        setPermDivId("");
                        setPermDistId("");
                        setPermThanaId("");
                        setCurDivId("");
                        setCurDistId("");
                        setCurThanaId("");
                        setSameAddress(false);
                        setForm((prev) => ({ ...prev, permanentAddressDetails: "", currentAddressDetails: "" }));
                      } else {
                        setForeignCountry("");
                        setForeignAddressDetails("");
                      }
                    }}
                    className="w-4 h-4 accent-emerald-700 rounded"
                  />
                  <span className="text-sm font-medium" style={{ color: "#064E3B" }}>
                    <LocalizedText text={t.registration.labelIsForeign} />
                  </span>
                </label>
              </div>

              {isForeign ? (
                <div className="space-y-4 p-4 rounded-sm" style={{ backgroundColor: "#F0FDF4", border: "1px solid rgba(10,61,42,0.15)" }}>
                  <p className="text-sm font-semibold" style={{ color: "#064E3B" }}>
                    <LocalizedText text={t.registration.labelForeignAddress} />
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                        <LocalizedText text={t.registration.labelCountry} /> *
                      </label>
                      <select
                        value={foreignCountry}
                        onChange={(e) => setForeignCountry(e.target.value)}
                        className={inputClass()}
                        required
                      >
                        <option value="">{t.registration.selectCountry}</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelForeignAddressDetails} /> *
                    </label>
                    <textarea
                      value={foreignAddressDetails}
                      onChange={(e) => setForeignAddressDetails(e.target.value)}
                      rows={3}
                      placeholder={t.registration.placeholderForeignAddress}
                      className={inputClass()}
                      required
                    ></textarea>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                        <LocalizedText text={t.registration.labelDivision} /> *
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
                        <option value="">{divisionsLoading ? t.registration.loading : t.registration.selectDivision}</option>
                        {permDivisions.map((d) => (
                          <option key={d.id} value={d.id}>
                            {loc("division", d.division)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                        <LocalizedText text={t.registration.labelDistrict} /> *
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
                        <option value="">{t.registration.selectDistrict}</option>
                        {permDistricts.map((d) => (
                          <option key={d.desId} value={d.desId}>
                            {loc("district", d.district)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                        <LocalizedText text={t.registration.labelThana} /> *
                      </label>
                      <select
                        value={permThanaId}
                        onChange={(e) => setPermThanaId(e.target.value)}
                        className={inputClass()}
                        disabled={!permDistId}
                        required
                      >
                        <option value="">{t.registration.selectThana}</option>
                        {permThanas.map((t) => (
                          <option key={t.id} value={t.id}>
                            {loc("thana", t.thana)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelVillageDetails} /> *
                    </label>
                    <textarea
                      name="permanentAddressDetails"
                      value={form.permanentAddressDetails}
                      onChange={handleChange}
                      rows={2}
                      placeholder={t.registration.placeholderVillage}
                      className={inputClass()}
                      required
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            {/* 4. Current Address — only when NOT foreign */}
            {!isForeign && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
                  <h3 className="text-lg font-bold" style={{ color: "#0A3D2A" }}>
                    <LocalizedText text={t.registration.sectionCurrentAddress} />
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
                      <LocalizedText text={t.registration.labelSameAsPermanent} />
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelDivision} /> *
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
                      <option value="">{divisionsLoading ? t.registration.loading : t.registration.selectDivision}</option>
                      {curDivisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {loc("division", d.division)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelDistrict} /> *
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
                      <option value="">{t.registration.selectDistrict}</option>
                      {(sameAddress ? permDistricts : curDistricts).map((d) => (
                        <option key={d.desId} value={d.desId}>
                          {loc("district", d.district)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelThana} /> *
                    </label>
                    <select
                      value={sameAddress ? permThanaId : curThanaId}
                      onChange={(e) => setCurThanaId(e.target.value)}
                      className={inputClass()}
                      disabled={sameAddress || !(sameAddress ? permDistId : curDistId)}
                      required
                    >
                      <option value="">{t.registration.selectThana}</option>
                      {(sameAddress ? permThanas : curThanas).map((t) => (
                        <option key={t.id} value={t.id}>
                          {loc("thana", t.thana)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelCurrentAddressDetails} /> *
                  </label>
                  <textarea
                    name="currentAddressDetails"
                    value={sameAddress ? form.permanentAddressDetails : form.currentAddressDetails}
                    onChange={handleChange}
                    rows={2}
                    placeholder={t.registration.placeholderCurrentAddress}
                    className={inputClass()}
                    disabled={sameAddress}
                    required
                  ></textarea>
                </div>
              </div>
            )}

            {/* 5. Occupation & Security */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                <LocalizedText text={t.registration.sectionOccupation} />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelOccupation} /> *
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
                        {occLabels.length > 0
                          ? occLabels.join(", ")
                          : t.registration.selectHere}
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
                        {t.registration.occupations.map(({ value: job, label }) => (
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
                            {label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                    <LocalizedText text={t.registration.labelOccupationDetails} />
                  </label>
                  <input
                    type="text"
                    name="occupationDetails"
                    value={form.occupationDetails}
                    onChange={handleChange}
                    placeholder={t.registration.placeholderOccupation}
                    className={inputClass()}
                  />
                </div>
              </div>
            </div>

            {/* 6. Payment */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-1" style={{ color: "#0A3D2A", borderColor: "rgba(10,61,42,0.15)" }}>
                <LocalizedText text={t.registration.sectionSendMoney} />
              </h3>
              <div className="p-4 rounded-sm" style={{ backgroundColor: "#F0FDF4", border: "1px solid rgba(10,61,42,0.15)" }}>
                {/* অতিথি নির্বাচন */}
                <div className="mb-4 p-3 rounded-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
                  <p className="text-lg font-semibold mb-1" style={{ color: "#064E3B" }}>
                    <LocalizedText text={t.registration.guestQuestion} />
                  </p>
                  <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
                    {fmt(t.registration.guestNote, { max: MAX_GUESTS, fee: num(GUEST_FEE) })}
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
                            {count === 0 ? t.registration.noGuests : fmt(t.registration.personCount, { n: count })}
                          </span>
                          <span
                            className="block text-sm"
                            style={{ color: selected ? "#C9BFA6" : "#6B7280" }}
                          >
                            {count === 0 ? t.registration.zeroTaka : fmt(t.registration.amountTaka, { n: count * GUEST_FEE })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* টাকার হিসাব */}
                <div className="mb-4 p-3 rounded-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-lg" style={{ color: "#6B7280" }}><LocalizedText text={t.registration.labelRegistrationFee} /></span>
                    <span className="text-lg font-semibold" style={{ color: "#064E3B" }}>
                      {fmt(t.registration.amountTaka, { n: num(REGISTRATION_FEE) })}
                    </span>
                  </div>

                  {guestCount > 0 && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-lg" style={{ color: "#6B7280" }}>
                        {fmt(t.registration.labelGuestFee, { count: num(guestCount), fee: num(GUEST_FEE) })}
                      </span>
                      <span className="text-lg font-semibold" style={{ color: "#064E3B" }}>
                        {fmt(t.registration.amountTaka, { n: num(guestTotal) })}
                      </span>
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-2 pt-3"
                    style={{ borderTop: "1px solid rgba(10,61,42,0.15)" }}
                  >
                    <span className="text-lg font-semibold" style={{ color: "#064E3B" }}><LocalizedText text={t.registration.labelGrandTotal} /></span>
                    <span className="text-2xl font-bold" style={{ color: "#0A3D2A" }}>
                      {fmt(t.registration.amountTaka, { n: num(grandTotal) })}
                    </span>
                  </div>
                </div>

                <p className="text-lg font-semibold mb-3" style={{ color: "#064E3B" }}>
                  {fmt(t.registration.bkashInstruction, { total: num(grandTotal) })}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base" style={{ color: "#6B7280" }}><LocalizedText text={t.registration.number1} /></span>
                    <span className="text-base sm:text-lg font-bold" style={{ color: "#0A3D2A" }}>01775900779</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base" style={{ color: "#6B7280" }}><LocalizedText text={t.registration.number2} /></span>
                    <span className="text-base sm:text-lg font-bold" style={{ color: "#0A3D2A" }}>01727728792</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelReceiverNumber} /> *
                    </label>
                    <select
                      id="field-receiverNumber"
                      value={receiverNumber}
                      onChange={(e) => setReceiverNumber(e.target.value)}
                      className={inputClass("field-receiverNumber")}
                      required
                    >
                      <option value="">{t.registration.selectNumber}</option>
                      <option value="01775900779">01775900779</option>
                      <option value="01727728792">01727728792</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelPaidAmount} /> *
                    </label>
                    <input
                      id="field-paidAmount"
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      placeholder={t.registration.placeholderPaidAmount}
                      className={inputClass("field-paidAmount")}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelTransactionId} /> *
                    </label>
                    <input
                      id="field-transactionId"
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={t.registration.placeholderTransactionId}
                      className={inputClass("field-transactionId")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      <LocalizedText text={t.registration.labelLastFourDigits} /> *
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
                      placeholder={t.registration.placeholderLastFour}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Link
                href={href("/")}
                className="text-base font-semibold py-2.5 px-5 rounded-sm transition text-center"
                style={{ color: "#064E3B", backgroundColor: "#F3F4F6" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
              >
                {t.registration.cancel}
              </Link>
              <button
                type="submit"
                disabled={loading || selectedDepartments.length === 0 || selectedOccupations.length === 0 || !transactionId.trim() || lastFourDigits.length !== 4}
                className="text-white text-base font-semibold py-2.5 px-6 rounded-sm hover:opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: "#0A3D2A" }}
              >
                {loading ? t.registration.submitting : t.registration.submit}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm sm:text-base" style={{ borderTop: "1px solid rgba(10,61,42,0.15)", backgroundColor: "#FFFFFF", color: "#6B7280" }}>
        <p><LocalizedText text={t.registration.footer} /></p>
      </footer>
    </div>
  );
}
