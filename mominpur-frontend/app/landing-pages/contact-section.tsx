"use client";

import { useState } from "react";

// নতুন কন্টাক্ট ইনফোসহ আপডেট করা অ্যারে
const contacts = [

  { name: "মোঃ মিফতাহ উদ্দিন", phone: "+880 1775-900779" },
    { name: "খোরশেদ আলম", phone: "+880 1727-728792" },
  { name: "মোঃ শাহেদ আহম্মেদ (সিলেট)", phone: "+880 1717-870310" },
  { name: "মোঃ হুমায়ন খান (সিলেট)", phone: "+880 1713-811740" },
  { name: "মোঃ হুজাইফা (মিরপুর)", phone: "+880 1817-574268" },
  { name: "মোঃ আসাদুল্লাহ (মোহাম্মাদিয়া লাইব্রেরী), Puran Dhaka", phone: "+880 1817-575158" },
];

// গ্লোবাল ফন্ট কনফিগারেশন
const BANGLA_FONT = "'Hind Siliguri', 'SolaimanLipi', 'Aneuro', sans-serif";
const NUMBER_FONT = "Inter, system-ui, -apple-system, sans-serif";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/messages/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      if (res.ok) {
        setResult(text);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setResult("Error: " + text);
      }
    } catch {
      setResult("Error: সার্ভারে সংযোগ করা যায়নি।");
    } finally {
      loading && setLoading(false);
    }
  };

  const inputClass =
    "w-full text-sm md:text-base px-3.5 py-2.5 border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-all duration-200 placeholder:text-gray-300";

  return (
    <section 
      id="contact" 
      className="max-w-6xl mx-auto px-4 py-24 select-none"
      style={{ fontFamily: BANGLA_FONT }}
    >
      {/* হেড সেকশন */}
      <div className="text-center mb-20 relative">
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: "#0A3D2A" }}>
          যোগাযোগ
        </p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: "#0B4230" }}>
          যেকোনো প্রয়োজনে যোগাযোগ করুন
        </h2>
        <div className="w-24 h-1 mx-auto mt-5 rounded-full" style={{ backgroundColor: "#0A3D2A" }} />
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* বাম কলাম: যোগাযোগের তথ্য ও ঠিকানা */}
        <div className="lg:col-span-5 space-y-6">
        
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {contacts.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-4 p-4 rounded-sm border transition-all duration-300 hover:shadow-sm"
                style={{ 
                  backgroundColor: "#FFFFFF", 
                  borderColor: "rgba(10,61,42,0.12)" 
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#0A3D2A" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm md:text-base truncate" style={{ color: "#064E3B" }}>{c.name}</p>
                  {c.phone ? (
                    <a 
                      href={`tel:${c.phone.replace(/\s/g, "")}`} 
                      className="text-sm md:text-base hover:underline block font-semibold mt-0.5" 
                      style={{ color: "#0A3D2A", fontFamily: NUMBER_FONT }}
                    >
                      {c.phone}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium block mt-0.5">নম্বর উপলব্ধ নেই</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* স্থায়ী ঠিকানা পার্ট */}
          <div className="p-5 rounded-sm border" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(10,61,42,0.12)" }}>
            <h4 className="font-bold mb-2 text-sm md:text-base" style={{ color: "#064E3B" }}>ঠিকানা</h4>
            <p className="text-sm md:text-base leading-relaxed text-gray-500">
              <span className="font-semibold" style={{ color: "#0A3D2A" }}>আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর</span>
              <br />
              পোঃ শাহ্তলী, উপজেলাঃ চাঁদপুর সদর, জেলাঃ চাঁদপুর, বাংলাদেশ।
            </p>
          </div>
        </div>

        {/* ডান কলাম: বার্তা পাঠানোর ফর্ম */}
        <div className="lg:col-span-7">
          <h3 className="text-xl font-bold tracking-tight mb-6" style={{ color: "#064E3B" }}>
            বার্তা পাঠান
          </h3>

          
          {result && (
            <div className="mb-6 p-4 rounded-sm text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {result}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">নাম *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="আপনার নাম প্রবেশ করুন"
                className={inputClass}
                style={{ borderColor: "rgba(10,61,42,0.15)" }}
                required
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">ইমেইল</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className={inputClass}
                  style={{ borderColor: "rgba(10,61,42,0.15)", fontFamily: NUMBER_FONT }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">ফোন নম্বর *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                  style={{ borderColor: "rgba(10,61,42,0.15)", fontFamily: NUMBER_FONT }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">বার্তা *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="আপনার মতামত বা বার্তা এখানে লিখুন..."
                rows={5}
                className={inputClass}
                style={{ borderColor: "rgba(10,61,42,0.15)" }}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold text-sm md:text-base py-3 rounded-sm hover:opacity-95 shadow-sm active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
              style={{ backgroundColor: "#0A3D2A" }}
            >
              {loading ? "বার্তা পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}