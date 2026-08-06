"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";

interface EventCardProps {
  name: string;
  phone: string;
  guestCount: number;
}

function bn(n: number): string {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n).replace(/\d/g, (d) => digits[parseInt(d)]);
}

export default function EventCard({ name, phone, guestCount }: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#FFFFFF",
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `invitation-${phone}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      alert("দুঃখিত, কার্ডটি ডাউনলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setDownloading(false);
    }
  };

  const qrUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify?phone=${phone}`
      : "";

  const totalPersons = 1 + (guestCount || 0);

  const styles = {
    card: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
      fontFamily: "'SolaimanLipi', sans-serif",
      position: "relative" as const,
      border: "1px solid #E5E7EB",
    },
    header: {
      background: "linear-gradient(135deg, #0A3D2A 0%, #064E3B 100%)",
      padding: "20px 16px",
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
      fontSize: "20px",
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
      padding: "20px",
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
      gridTemplateColumns: guestCount > 0 ? "1fr 1fr 1fr" : "1fr 1fr",
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
      color: "#059669",
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
      gap: "14px",
      padding: "16px",
      backgroundColor: "#F0FDF4",
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
      <div style={{ fontFamily: "'SolaimanLipi', sans-serif" }}>
        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full max-w-[500px] flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base text-white font-semibold rounded-xl hover:opacity-90 transition all duration-200 shadow-md disabled:opacity-60 mb-6 sm:mb-8 active:scale-[0.98]"
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

            {/* Invitation Text */}
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
              {guestCount > 0 && (
                <div style={{...styles.detailBox, backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7'}}>
                  <div style={{...styles.detailLabel, color: '#D97706'}}>অতিথি</div>
                  <div style={styles.detailValue}>{bn(guestCount)} জন</div>
                  <div style={{fontSize: '12px', color: '#92400E'}}>সর্বমোট {bn(totalPersons)} জন</div>
                </div>
              )}
            </div>

            {/* Guest Badge - only if guests exist */}
            {guestCount > 0 && (
              <div style={{
                marginBottom: '25px',
                padding: '16px 20px',
                backgroundColor: '#FFFBEB',
                borderRadius: '12px',
                border: '1px solid #FEF3C7',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '2px'}}>
                    সাথে {bn(guestCount)} জন অতিথি
                  </div>
                  <div style={{fontSize: '12px', color: '#B45309', lineHeight: 1.5}}>
                    এই এন্ট্রি পাসে আপনার সাথে {bn(guestCount)} জন অতিথির প্রবেশাধিকার অন্তর্ভুক্ত রয়েছে। মোট প্রবেশ: {bn(totalPersons)} জন।
                  </div>
                </div>
              </div>
            )}

            {/* QR Code & Info */}
            <div style={styles.qrSection}>
              <div style={styles.qrContainer}>
                <QRCodeSVG
                  value={qrUrl}
                  size={80}
                  bgColor="#FFFFFF"
                  fgColor="#064E3B"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.qrInfoTitle}>ডিজিটাল এন্ট্রি পাস</div>
                <div style={styles.qrInfoText}>
                  অনুগ্রহ করে প্রবেশের সময় এই QR কোডটি স্ক্যান করুন। স্ক্যান করলে সরাসরি ভেরিফিকেশন হয়ে যাবে।
                </div>
                {guestCount > 0 && (
                  <div style={{
                    marginTop: '8px',
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#D97706',
                    backgroundColor: '#FEF3C7',
                    padding: '3px 10px',
                    borderRadius: '100px',
                  }}>
                    প্রবেশ: {bn(totalPersons)} জন
                  </div>
                )}
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
