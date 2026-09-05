"use client";

import { useMemo, useState } from "react";
import { exportPDF } from "./export-utils";

interface Registration {
  id: number;
  name: string;
  fatherName: string;
  phone: string;
  bloodGroup: string;
  studyFrom: string;
  studyTo: string;
  departments: string;
  permanentDivision: string;
  permanentDistrict: string;
  permanentThana: string;
  permanentCountry: string;
  occupation: string;
  status: string;
  submittedAt: string;
  guestCount: number;
}

type ViewMode = "country" | "division" | "district" | "year" | "detail";

const inputClass =
  "w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";
const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1";

const DEPARTMENTS = ["নাজেরা", "হিফজ", "কিতাব"];

function getDepartmentsOf(r: Registration): string[] {
  return (r.departments || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function countByStatus(list: Registration[]) {
  const approved = list.filter((r) => r.status === "APPROVED").length;
  const pending = list.filter((r) => r.status === "PENDING").length;
  const rejected = list.filter((r) => r.status === "REJECTED").length;
  return { total: list.length, approved, pending, rejected };
}

export default function StudentReport({ registrations }: { registrations: Registration[] }) {
  const [view, setView] = useState<ViewMode>("division");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const countries = useMemo(() => [...new Set(registrations.map((r) => r.permanentCountry))].filter(Boolean).sort(), [registrations]);
  const divisions = useMemo(() => [...new Set(registrations.map((r) => r.permanentDivision))].filter(Boolean).sort(), [registrations]);
  const districts = useMemo(() => {
    if (!divisionFilter) return [...new Set(registrations.map((r) => r.permanentDistrict))].filter(Boolean).sort();
    return [...new Set(registrations.filter((r) => r.permanentDivision === divisionFilter).map((r) => r.permanentDistrict))].filter(Boolean).sort();
  }, [registrations, divisionFilter]);

  const filtered = useMemo(() => {
    let list = registrations;
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    if (countryFilter) list = list.filter((r) => r.permanentCountry === countryFilter);
    if (divisionFilter) list = list.filter((r) => r.permanentDivision === divisionFilter);
    if (districtFilter) list = list.filter((r) => r.permanentDistrict === districtFilter);
    if (departmentFilter) list = list.filter((r) => getDepartmentsOf(r).includes(departmentFilter));
    if (yearFrom) list = list.filter((r) => r.studyFrom >= yearFrom);
    if (yearTo) list = list.filter((r) => r.studyFrom <= yearTo);
    return list;
  }, [registrations, statusFilter, countryFilter, divisionFilter, districtFilter, departmentFilter, yearFrom, yearTo]);

  const summary = useMemo(() => countByStatus(filtered), [filtered]);

  const countryWise = useMemo(() => {
    const map: Record<string, Registration[]> = {};
    filtered.forEach((r) => {
      if (!r.permanentCountry) return;
      (map[r.permanentCountry] ??= []).push(r);
    });
    return Object.entries(map)
      .map(([name, list]) => ({ name, ...countByStatus(list) }))
      .sort((a, b) => b.total - a.total);
  }, [filtered]);

  const divisionWise = useMemo(() => {
    const map: Record<string, Registration[]> = {};
    filtered.forEach((r) => {
      if (!r.permanentDivision) return;
      (map[r.permanentDivision] ??= []).push(r);
    });
    return Object.entries(map)
      .map(([name, list]) => ({ name, ...countByStatus(list) }))
      .sort((a, b) => b.total - a.total);
  }, [filtered]);

  const districtWise = useMemo(() => {
    const map: Record<string, { division: string; list: Registration[] }> = {};
    filtered.forEach((r) => {
      if (!r.permanentDistrict) return;
      if (!map[r.permanentDistrict]) map[r.permanentDistrict] = { division: r.permanentDivision || "Unknown", list: [] };
      map[r.permanentDistrict].list.push(r);
    });
    return Object.entries(map)
      .map(([name, { division, list }]) => ({ name, division, ...countByStatus(list) }))
      .sort((a, b) => b.total - a.total);
  }, [filtered]);

  const yearWise = useMemo(() => {
    const map: Record<string, Registration[]> = {};
    filtered.forEach((r) => {
      const key = r.studyFrom || "Unknown";
      (map[key] ??= []).push(r);
    });
    return Object.entries(map)
      .map(([year, list]) => ({ year, ...countByStatus(list) }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }, [filtered]);

  const views: { key: ViewMode; label: string }[] = [
    { key: "country", label: "Country Wise" },
    { key: "division", label: "Division Wise" },
    { key: "district", label: "District Wise" },
    { key: "year", label: "Year Wise" },
    { key: "detail", label: "Detailed" },
  ];

  interface DetailRow {
    name: string;
    fatherName: string;
    phone: string;
    studyPeriod: string;
    occupation: string;
    district: string;
    thana: string;
  }

  const detailRows = useMemo<DetailRow[]>(
    () =>
      filtered.map((r) => ({
        name: r.name || "-",
        fatherName: r.fatherName || "",
        phone: r.phone || "-",
        studyPeriod: r.studyFrom && r.studyTo ? `${r.studyFrom} - ${r.studyTo}` : r.studyFrom || "-",
        occupation: r.occupation || "-",
        district: r.permanentDistrict || "-",
        thana: r.permanentThana || "-",
      })),
    [filtered]
  );

  function getTableData(forExport = false): { columns: string[]; rows: (string | number)[][] } {
    if (view === "detail") {
      return forExport
        ? {
            columns: ["SL", "Name", "Father's Name", "Phone", "অধ্যয়নকাল", "Occupation", "District", "Thana"],
            rows: detailRows.map((d, i) => [i + 1, d.name, d.fatherName || "-", d.phone, d.studyPeriod, d.occupation, d.district, d.thana]),
          }
        : {
            columns: ["SL", "Name", "Phone", "অধ্যয়নকাল", "Occupation", "District", "Thana"],
            rows: detailRows.map((d, i) => [i + 1, d.name, d.phone, d.studyPeriod, d.occupation, d.district, d.thana]),
          };
    }
    if (view === "country") {
      return {
        columns: ["Country", "Total", "Approved", "Pending", "Rejected"],
        rows: countryWise.map((d) => [d.name, d.total, d.approved, d.pending, d.rejected]),
      };
    }
    if (view === "division") {
      return {
        columns: ["Division", "Total", "Approved", "Pending", "Rejected"],
        rows: divisionWise.map((d) => [d.name, d.total, d.approved, d.pending, d.rejected]),
      };
    }
    if (view === "district") {
      return {
        columns: ["District", "Division", "Total", "Approved", "Pending"],
        rows: districtWise.map((d) => [d.name, d.division, d.total, d.approved, d.pending]),
      };
    }
    return {
      columns: ["Start Year", "Total", "Approved", "Pending", "Rejected"],
      rows: yearWise.map((d) => [d.year, d.total, d.approved, d.pending, d.rejected]),
    };
  }

  async function handleExportPDF() {
    const { columns, rows } = getTableData(true);
    try {
      await exportPDF({
        title: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর",
        subtitle: "স্টুডেন্ট রিপোর্ট",
        details: [
          { label: "মোট", value: `${summary.total.toLocaleString("en-US")}` },
          { label: "অনুমোদিত", value: `${summary.approved.toLocaleString("en-US")}` },
          { label: "পেন্ডিং", value: `${summary.pending.toLocaleString("en-US")}` },
          { label: "বাতিল", value: `${summary.rejected.toLocaleString("en-US")}` },
        ],
        columns,
        rows,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      alert("দুঃখিত, PDF তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  const { columns, rows } = getTableData();

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className={labelClass}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="">All</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <select value={countryFilter} onChange={(e) => { setCountryFilter(e.target.value); setDivisionFilter(""); setDistrictFilter(""); }} className={inputClass}>
              <option value="">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Division</label>
            <select value={divisionFilter} onChange={(e) => { setDivisionFilter(e.target.value); setDistrictFilter(""); }} className={inputClass}>
              <option value="">All Divisions</option>
              {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>District</label>
            <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className={inputClass}>
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className={inputClass}>
              <option value="">All</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div>
            <label className={labelClass}>Study Year (From)</label>
            <input type="text" placeholder="e.g. 2000" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Study Year (To)</label>
            <input type="text" placeholder="e.g. 2025" value={yearTo} onChange={(e) => setYearTo(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setStatusFilter(""); setCountryFilter(""); setDivisionFilter(""); setDistrictFilter(""); setDepartmentFilter(""); setYearFrom(""); setYearTo(""); }}
              className="w-full px-3 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: summary.total, gradient: "from-emerald-500 to-emerald-600" },
          { label: "Approved", value: summary.approved, gradient: "from-teal-500 to-cyan-500" },
          { label: "Pending", value: summary.pending, gradient: "from-amber-500 to-orange-500" },
          { label: "Rejected", value: summary.rejected, gradient: "from-rose-500 to-red-500" },
        ].map((c) => (
          <div key={c.label} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${c.gradient} p-4 text-white shadow-sm`}>
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value.toLocaleString()}</p>
            <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      {/* View tabs + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                view === v.key
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                  : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                    No data found
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {view === "detail" && j === 1 ? (
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{cell}</p>
                            {detailRows[i]?.fatherName && (
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">পিতা: {detailRows[i].fatherName}</p>
                            )}
                          </div>
                        ) : typeof cell === "number" ? cell.toLocaleString() : cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
