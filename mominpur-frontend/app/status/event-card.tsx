"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";

interface EventCardProps {
  name: string;
  phone: string;
}

export default function EventCard({ name, phone }: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // আরো ভালো কোয়ালিটির জন্য স্কেল বাড়ানো হয়েছে
        backgroundColor: "#FFFFFF", // ট্রান্সপারেন্ট সমস্যা এড়াতে সাদা ব্যাকগ্রাউন্ড
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `invitation-${phone}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      alert("দুঃখিত, কার্ডটি ডাউনলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setDownloading(false);
    }
  };

  // QR কোড স্ক্যান করলে সরাসরি ভেরিফিকেশন পেজে নিয়ে যাবে ফোন নম্বরসহ
  const qrUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify?phone=${phone}`
      : "";

  // ইনলাইন স্টাইল অবজেক্টস (পরিচ্ছন্নতার জন্য)
  const styles = {
    card: {
      width: "500px", // সামান্য চওড়া করা হয়েছে
      backgroundColor: "#FFFFFF",
      borderRadius: "16px", // আধুনিক রাউন্ডেড কর্নার
      overflow: "hidden",
      boxShadow: "0 10px 40px rgba(0,0,0,0.1)", // সফট শ্যাডো
      fontFamily: "'Hind Siliguri', sans-serif", // নিশ্চিত করুন এই ফন্ট লোড করা আছে
      position: "relative" as const,
      border: "1px solid #E5E7EB",
    },
    header: {
      background: "linear-gradient(135deg, #0A3D2A 0%, #064E3B 100%)", // গ্রেডিয়েন্ট হেডার
      padding: "30px 24px",
      textAlign: "center" as const,
      position: "relative" as const,
    },
    headerBadge: {
      display: "inline-block",
      fontSize: "12px",
      letterSpacing: "2px",
      textTransform: "uppercase" as const,
      color: "#A7F3D0",
      backgroundColor: "rgba(255,255,255,0.1)",
      padding: "4px 12px",
      borderRadius: "100px",
      marginBottom: "12px",
      fontWeight: 600,
    },
    organizationName: {
      fontSize: "24px",
      fontWeight: 800,
      color: "#FFFFFF",
      lineHeight: 1.2,
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    eventName: {
      fontSize: "14px",
      color: "#D1FAE5",
      marginTop: "6px",
      fontWeight: 500,
    },
    body: {
      padding: "30px",
    },
    guestSection: {
      textAlign: "center" as const,
      marginBottom: "25px",
      paddingBottom: "20px",
      borderBottom: "1px dashed #E5E7EB",
    },
    guestLabel: {
      fontSize: "13px",
      color: "#6B7280",
      marginBottom: "4px",
    },
    guestName: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#111827",
      lineHeight: 1.4,
    },
    guestPhone: {
      fontSize: "12px",
      color: "#6B7280",
      marginTop: "2px",
    },
    invitationText: {
      textAlign: "center" as const,
      fontSize: "14px",
      color: "#374151",
      lineHeight: 1.8,
      marginBottom: "25px",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "25px",
    },
    detailBox: {
      padding: "16px",
      backgroundColor: "#F9FAFB",
      borderRadius: "12px",
      border: "1px solid #F3F4F6",
      textAlign: "center" as const,
    },
    detailLabel: {
      fontSize: "11px",
      color: "#059669", // সবুজ শেড
      fontWeight: 600,
      letterSpacing: "1px",
      textTransform: "uppercase" as const,
      marginBottom: "6px",
    },
    detailValue: {
      fontSize: "16px",
      fontWeight: 700,
      color: "#111827",
    },
    qrSection: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#F0FDF4", // হালকা সবুজ ব্যাকগ্রাউন্ড
      borderRadius: "12px",
      border: "1px solid #DCFCE7",
    },
    qrContainer: {
      padding: "10px",
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
      border: "1px solid #E5E7EB",
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    qrInfoTitle: {
      fontSize: "13px",
      color: "#064E3B",
      fontWeight: 600,
      marginBottom: "4px",
    },
    qrInfoText: {
      fontSize: "12px",
      color: "#374151",
      lineHeight: 1.5,
    },
    footer: {
      borderTop: "1px solid #F3F4F6",
      padding: "16px 24px",
      textAlign: "center" as const,
      fontSize: "12px",
      color: "#6B7280",
      backgroundColor: "#F9FAFB",
    },
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      {/* UI Container to centralize and manage fonts */}
      <div style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full max-w-[500px] flex items-center justify-center gap-2.5 px-8 py-3.5 text-white font-semibold rounded-xl hover:opacity-90 transition all duration-200 shadow-md disabled:opacity-60 mb-8 active:scale-[0.98]"
          style={{ backgroundColor: "#0A3D2A" }}
        >
          {downloading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          )}
          {downloading ? "প্রসেস হচ্ছে..." : "ডিজিটাল আমন্ত্রণ পত্রটি ডাউনলোড করুন"}
        </button>

        {/* Printable Card Area */}
        <div ref={cardRef} style={styles.card}>
          {/* Top Header Bar */}
          <div style={styles.header}>
            {/* Decorative pattern visual only (Optional - can remove if html2canvas struggles) */}
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'0 0 20 20\'%3%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3%3Cpath d=\'M0 0h20L10 10z\'/%3%3C/g%3%3C/svg%3%3E")'}}></div>
            
            <div style={{position: 'relative', zIndex: 1}}>
              <div style={styles.headerBadge}>আমন্ত্রণ পত্র</div>
              <div style={styles.organizationName}>ইত্তেহাদে আবনায়ে মুমিনপুর</div>
              <div style={styles.eventName}>গ্রান্ড পুনর্মিলনী ২০২৬</div>
            </div>
          </div>

          {/* Body */}
          <div style={styles.body}>
            {/* Greeting */}
            <div style={styles.guestSection}>
              <div style={styles.guestLabel}>সম্মানিত সুধী,</div>
              <div style={styles.guestName}> {name}</div>
              <div style={styles.guestPhone}>মোবাইল: {phone}</div>
            </div>

            {/* Invitation Text - Corrected and made professional */}
            <div style={styles.invitationText}>
              আসসালামু আলাইকুম। আল্লাহর অশেষ রহমতে আসন্ন <strong>ইত্তেহাদে আবনায়ে মুমিনপুর পুনর্মিলনী</strong> অনুষ্ঠানে আপনাকে আন্তরিকভাবে আমন্ত্রণ জানাচ্ছি। আপনার উপস্থিতি অনুষ্ঠানটিকে সফল ও সার্থক করে তুলবে।
            </div>

            {/* Event Details Grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailBox}>
                <div style={styles.detailLabel}>তারিখ</div>
                <div style={styles.detailValue}>১৬ ডিসেম্বর, ২০২৬</div>
                <div style={{fontSize: '12px', color: '#6B7280'}}>রোজ: বুধবার</div>
              </div>
              <div style={styles.detailBox}>
                <div style={styles.detailLabel}>স্থান</div>
                <div style={styles.detailValue}>মাদরাসা প্রাঙ্গণ</div>
                <div style={{fontSize: '12px', color: '#6B7280'}}>মুমিনপুর, চাঁদপুর</div>
              </div>
            </div>

            {/* QR Code & Info - More Professional Entry Pass feel */}
            <div style={styles.qrSection}>
              <div style={styles.qrContainer}>
                <QRCodeSVG
                  value={qrUrl}
                  size={80}
                  bgColor="#FFFFFF"
                  fgColor="#064E3B" // হেডার কালারের সাথে মিল রেখে
                  level="H" // হায়ার এরর কারেকশন
                  includeMargin={false}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.qrInfoTitle}>ডিজিটাল এন্ট্রি পাস</div>
                  <div style={styles.qrInfoText}>
                    অনুগ্রহ করে প্রবেশের সময় এই QR কোডটি স্ক্যান করুন। স্ক্যান করলে সরাসরি ভেরিফিকেশন হয়ে যাবে।
                  </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            ঠিকানা: পোঃ শাহ্তলী, উপজেলাঃ চাঁদপুর সদর, জেলাঃ চাঁদপুর, বাংলাদেশ।
          </div>
        </div>
      </div>
    </div>
  );
}