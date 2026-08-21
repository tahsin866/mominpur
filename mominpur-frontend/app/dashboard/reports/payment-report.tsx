"use client";

import { useMemo, useState } from "react";
import { formatDate, formatMonth, exportPDF, exportExcel } from "./export-utils";

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

interface Registration {
  id: number;
  name: string;
  phone: string;
  status: string;
}

type ViewMode = "date" | "month" | "receiver" | "detail";

const inputClass =
  "w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";
const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1";

export default function PaymentReport({ transactions, registrations }: { transactions: Transaction[]; registrations: Registration[] }) {
  const [view, setView] = useState<ViewMode>("date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [receiverFilter, setReceiverFilter] = useState("");

  const approvedRegIds = useMemo(
    () => new Set(registrations.filter((r) => r.status === "APPROVED").map((r) => r.id)),
    [registrations]
  );

  const filtered = useMemo(() => {
    let list = transactions.filter(
      (t) => t.status === "APPROVED" && approvedRegIds.has(t.registrationId)
    );
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((t) => new Date(t.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((t) => new Date(t.createdAt) <= to);
    }
    if (receiverFilter) {
      list = list.filter((t) => t.receiverNumber === receiverFilter);
    }
    return list;
  }, [transactions, approvedRegIds, dateFrom, dateTo, receiverFilter]);

  const receiverNumbers = useMemo(
    () => [...new Set(transactions.map((t) => t.receiverNumber))].filter(Boolean),
    [transactions]
  );

  const summary = useMemo(() => {
    const totalIncome = filtered.reduce((s, t) => s + t.paidAmount, 0);

    const perReceiver: Record<string, number> = {};
    filtered.forEach((t) => {
      perReceiver[t.receiverNumber] = (perReceiver[t.receiverNumber] || 0) + t.paidAmount;
    });

    return { totalIncome, approvedCount: filtered.length, perReceiver };
  }, [filtered]);

  const systemTotal = useMemo(
    () => filtered.reduce((s, t) => s + (t.totalAmount || 0), 0),
    [filtered]
  );

  const dateRangeLabel = useMemo(() => {
    if (filtered.length === 0) return "-";
    const times = filtered.map((t) => new Date(t.createdAt).getTime()).filter((n) => !isNaN(n));
    if (times.length === 0) return "-";
    const from = dateFrom ? formatDate(dateFrom) : formatDate(new Date(Math.min(...times)).toISOString());
    const to = dateTo ? formatDate(dateTo) : formatDate(new Date(Math.max(...times)).toISOString());
    return `${from} থেকে ${to} পর্যন্ত`;
  }, [filtered, dateFrom, dateTo]);

  const dateWise = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filtered.forEach((t) => {
      const key = new Date(t.createdAt).toISOString().split("T")[0];
      if (!map[key]) map[key] = { count: 0, total: 0 };
      map[key].count++;
      map[key].total += t.paidAmount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, d]) => ({ date, ...d }));
  }, [filtered]);

  const monthWise = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filtered.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { count: 0, total: 0 };
      map[key].count++;
      map[key].total += t.paidAmount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, d]) => ({ month: month + "-01", ...d }));
  }, [filtered]);

  const receiverWise = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filtered.forEach((t) => {
      const key = t.receiverNumber || "Unknown";
      if (!map[key]) map[key] = { count: 0, total: 0 };
      map[key].count++;
      map[key].total += t.paidAmount;
    });
    return Object.entries(map).map(([number, d]) => ({ number, ...d }));
  }, [filtered]);

  const views: { key: ViewMode; label: string }[] = [
    { key: "date", label: "Date Wise" },
    { key: "month", label: "Month Wise" },
    { key: "receiver", label: "Receiver Wise" },
    { key: "detail", label: "Detailed" },
  ];

  const regMap = useMemo(() => {
    const m = new Map<number, Registration>();
    registrations.forEach((r) => m.set(r.id, r));
    return m;
  }, [registrations]);

  const detailRows = useMemo(
    () =>
      filtered
        .map((t) => {
          const reg = regMap.get(t.registrationId);
          return {
            date: t.createdAt,
            name: reg?.name || "-",
            phone: reg?.phone || "-",
            payingNumber: t.payingNumber || "-",
            transactionId: t.transactionId || "-",
            receiverNumber: t.receiverNumber || "-",
            amount: t.paidAmount,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [filtered, regMap]
  );

  function getTableData(): { columns: string[]; rows: (string | number)[][] } {
    if (view === "date") {
      return {
        columns: ["Date", "Transactions", "Total Amount"],
        rows: dateWise.map((d) => [formatDate(d.date), d.count, d.total]),
      };
    }
    if (view === "month") {
      return {
        columns: ["Month", "Transactions", "Total Amount"],
        rows: monthWise.map((d) => [formatMonth(d.month), d.count, d.total]),
      };
    }
    if (view === "detail") {
      return {
        columns: ["SL", "Date", "Name", "Phone", "Last 4", "Transaction ID", "Receiver", "Amount"],
        rows: detailRows.map((d, i) => [i + 1, formatDate(d.date), d.name, d.phone, d.payingNumber, d.transactionId, d.receiverNumber, d.amount]),
      };
    }
    return {
      columns: ["Number", "Total Transactions", "Total Amount"],
      rows: receiverWise.map((d) => [d.number, d.count, d.total]),
    };
  }

  async function handleExportPDF() {
    const { columns, rows } = getTableData();
    try {
      await exportPDF({
        title: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর",
        subtitle: "নিবন্ধন পেমেন্ট রিপোর্ট",
        details: [
          { label: "তারিখ", value: dateRangeLabel },
          { label: "রিসিভার নম্বর", value: receiverFilter || "সকল" },
          { label: "সিস্টেম টোটাল", value: `${systemTotal.toLocaleString("en-US")} BDT` },
          { label: "প্রদত্ত টোটাল", value: `${summary.totalIncome.toLocaleString("en-US")} BDT` },
          { label: "মোট ট্রানজেকশন", value: `${filtered.length.toLocaleString("en-US")}` },
        ],
        columns,
        rows,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      alert("দুঃখিত, PDF তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  function handleExportExcel() {
    exportExcel("Payment Report", [
      {
        name: "Summary",
        columns: ["Description", "Value"],
        rows: [
          ["Total Approved Income", summary.totalIncome],
          ["Approved Transactions", summary.approvedCount],
          ...Object.entries(summary.perReceiver).map(([num, amt]) => [`${num} Income`, amt]),
        ],
      },
      {
        name: "Date Wise",
        columns: ["Date", "Transactions", "Total Amount"],
        rows: dateWise.map((d) => [d.date, d.count, d.total]),
      },
      {
        name: "Month Wise",
        columns: ["Month", "Transactions", "Total Amount"],
        rows: monthWise.map((d) => [d.month, d.count, d.total]),
      },
      {
        name: "Receiver Wise",
        columns: ["Number", "Total Transactions", "Total Amount"],
        rows: receiverWise.map((d) => [d.number, d.count, d.total]),
      },
      {
        name: "Detailed",
        columns: ["SL", "Date", "Name", "Phone", "Last 4", "Transaction ID", "Receiver", "Amount"],
        rows: detailRows.map((d, i) => [i + 1, d.date, d.name, d.phone, d.payingNumber, d.transactionId, d.receiverNumber, d.amount]),
      },
    ]);
  }

  const { columns, rows } = getTableData();

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={labelClass}>Start Date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Receiver Number</label>
            <select value={receiverFilter} onChange={(e) => setReceiverFilter(e.target.value)} className={inputClass}>
              <option value="">All Numbers</option>
              {receiverNumbers.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); setReceiverFilter(""); }}
              className="w-full px-3 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Total Approved Income</p>
          <p className="text-2xl font-bold mt-1">{summary.totalIncome.toLocaleString()} <span className="text-sm font-normal">BDT</span></p>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-white/80 uppercase tracking-wider">System Total</p>
          <p className="text-2xl font-bold mt-1">{systemTotal.toLocaleString()} <span className="text-sm font-normal">BDT</span></p>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Approved Transactions</p>
          <p className="text-2xl font-bold mt-1">{summary.approvedCount.toLocaleString()}</p>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Total Transactions</p>
          <p className="text-2xl font-bold mt-1">{transactions.length.toLocaleString()}</p>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Per-receiver income */}
      {Object.keys(summary.perReceiver).length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-3">Approved Income Per Number</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(summary.perReceiver).map(([num, amt]) => (
              <div key={num} className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg dark:bg-emerald-950/30 dark:border-emerald-900/50">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{num}:</span>
                <span className="ml-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">{amt.toLocaleString()} BDT</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View tabs + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-2">
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
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
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
                        {typeof cell === "number" ? cell.toLocaleString() : cell}
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
