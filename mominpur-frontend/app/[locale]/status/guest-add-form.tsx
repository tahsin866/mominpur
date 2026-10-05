"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { apiHeaders } from "@/lib/i18n/api";
import { LocalizedText } from "@/lib/i18n/LocalizedText";

interface GuestAddFormProps {
  phone: string;
  name: string;
  currentGuestCount: number;
  registrationId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const GUEST_FEE = 510;
const MAX_GUESTS = 2;

export default function GuestAddForm({
  phone,
  name,
  currentGuestCount,
  registrationId,
  onSuccess,
  onCancel,
}: GuestAddFormProps) {
  const { t, num, fmt, locale } = useLang();
  const remainingSlots = MAX_GUESTS - currentGuestCount;
  const [additionalGuests, setAdditionalGuests] = useState(1);
  const [receiverNumber, setReceiverNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalFee = additionalGuests * GUEST_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!receiverNumber) {
      setError(t.guestAdd.errSenderRequired);
      return;
    }
    if (!transactionId.trim()) {
      setError(t.guestAdd.errTransactionRequired);
      return;
    }
    if (!/^\d{4}$/.test(lastFourDigits)) {
      setError(t.guestAdd.errLastFourRequired);
      return;
    }
    if (!paidAmount || Number(paidAmount) < 1) {
      setError(t.guestAdd.errAmountRequired);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/registrations/add-guest", {
        method: "POST",
        headers: { ...apiHeaders(locale), "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          additionalGuests,
          transactionId: transactionId.trim(),
          payingNumber: lastFourDigits.trim(),
          receiverNumber,
          paidAmount: Number(paidAmount),
        }),
      });

      if (res.ok) {
        setSuccess(fmt(t.guestAdd.success, { n: additionalGuests }));
        setTimeout(() => onSuccess(), 3000);
      } else {
        const text = await res.text();
        setError(text || t.guestAdd.errGeneric);
      }
    } catch {
      setError(t.guestAdd.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full text-base px-3 py-2.5 border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="mt-5 rounded-sm overflow-hidden" style={{ border: "1px solid rgba(10,61,42,0.15)" }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FEF3C7" }}>
        <div>
          <h3 className="text-base font-bold" style={{ color: "#92400E" }}>{t.guestAdd.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>
            {fmt(t.guestAdd.subtitle, { name, n: remainingSlots })}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm font-medium px-3 py-1.5 rounded-sm hover:bg-amber-100 transition"
          style={{ color: "#92400E" }}
        >
          {t.common.cancel}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4" style={{ backgroundColor: "#FEFCE8" }}>
        {/* Guest Count Selector */}
        <div>
          <p className="text-sm font-semibold mb-2" style={{ color: "#064E3B" }}>
            <LocalizedText text={t.guestAdd.howMany} />
          </p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${remainingSlots}, 1fr)` }}>
            {Array.from({ length: remainingSlots }, (_, i) => i + 1).map((count) => {
              const selected = additionalGuests === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setAdditionalGuests(count)}
                  className="py-2.5 px-3 rounded-sm text-center transition"
                  style={{
                    backgroundColor: selected ? "#0A3D2A" : "#FFFFFF",
                    color: selected ? "#FFFFFF" : "#064E3B",
                    border: selected ? "2px solid #0A3D2A" : "1px solid rgba(10,61,42,0.25)",
                  }}
                >
                  <span className="block text-base font-semibold">{num(count)} {t.guestAdd.unitPersons}</span>
                  <span className="block text-sm" style={{ color: selected ? "#C9BFA6" : "#6B7280" }}>
                    {num(count * GUEST_FEE)} {t.guestAdd.unitTaka}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee Summary */}
        <div className="p-3 rounded-sm" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "#6B7280" }}>
              {fmt(t.guestAdd.feeLabel, { count: num(additionalGuests), fee: num(GUEST_FEE) })}
            </span>
            <span className="text-lg font-bold" style={{ color: "#0A3D2A" }}>
              {num(totalFee)} {t.guestAdd.unitTaka}
            </span>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="p-3 rounded-sm" style={{ backgroundColor: "#F0FDF4", border: "1px solid rgba(10,61,42,0.15)" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "#064E3B" }}>
            {fmt(t.guestAdd.bkashInstruction, { total: num(totalFee) })}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "#6B7280" }}>{t.guestAdd.number1}</span>
              <span className="text-base font-bold" style={{ color: "#0A3D2A" }}>01775900779</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "#6B7280" }}>{t.guestAdd.number2}</span>
              <span className="text-base font-bold" style={{ color: "#0A3D2A" }}>01727728792</span>
            </div>
          </div>
        </div>

        {/* Payment Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#6B7280" }}>
              <LocalizedText text={t.guestAdd.labelSender} /> *
            </label>
            <select
              value={receiverNumber}
              onChange={(e) => setReceiverNumber(e.target.value)}
              className={inputClass}
              style={{ borderColor: "rgba(10,61,42,0.2)" }}
              required
            >
              <option value="">{t.guestAdd.selectPlaceholder}</option>
              <option value="01775900779">01775900779</option>
              <option value="01727728792">01727728792</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#6B7280" }}>
              <LocalizedText text={t.guestAdd.labelAmount} /> *
            </label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder={t.guestAdd.amountPlaceholder}
              className={inputClass}
              style={{ borderColor: "rgba(10,61,42,0.2)" }}
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#6B7280" }}>
              <LocalizedText text={t.guestAdd.labelTransaction} /> *
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder={t.guestAdd.transactionPlaceholder}
              className={inputClass}
              style={{ borderColor: "rgba(10,61,42,0.2)" }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#6B7280" }}>
              <LocalizedText text={t.guestAdd.labelLastFour} /> *
            </label>
            <input
              type="text"
              value={lastFourDigits}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d{0,4}$/.test(val)) {
                  setLastFourDigits(val);
                }
              }}
              placeholder={t.guestAdd.lastFourPlaceholder}
              maxLength={4}
              className={inputClass}
              style={{ borderColor: "rgba(10,61,42,0.2)" }}
              required
            />
          </div>
        </div>

        {/* Error/Success */}
        {error && (
          <div className="p-3 rounded-sm text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-sm text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !!success}
          className="w-full py-3 text-white font-semibold rounded-sm hover:opacity-90 transition disabled:opacity-50"
          style={{ backgroundColor: "#D97706" }}
        >
          {loading ? t.guestAdd.submitting : fmt(t.guestAdd.submit, { n: additionalGuests })}
        </button>
      </form>
    </div>
  );
}
