"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Photo {
  id: number;
  filePath: string;
  contentType: string;
  size: number;
  section: string;
  createdAt: string;
}

const sections = [
  { value: "hero", label: "হিরো স্লাইডার" },
  { value: "gallery", label: "গ্যালারি" },
  { value: "about", label: "পরিচিতি" },
  { value: "event", label: "অনুষ্ঠান" },
];

const API = "";

export default function PhotosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [section, setSection] = useState("gallery");
  const [filterSection, setFilterSection] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Photo | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    fetchPhotos();
  }, [router]);

  // Auto-clear messages
  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(""), 4000); return () => clearTimeout(t); }
  }, [success]);
  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(""), 5000); return () => clearTimeout(t); }
  }, [error]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/photos`);
      const data = await res.json();
      setPhotos(data);
    } catch {
      setError("ছবি লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    try { return JSON.parse(raw).token; } catch { return null; }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const token = getToken();
    if (!token) { setError("লগইন প্রয়োজন"); return; }

    setUploading(true);
    setError("");
    setSuccess("");

    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("section", section);

      try {
        const res = await fetch(`${API}/api/photos/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) uploadedCount++;
      } catch {
        // continue
      }
    }

    if (uploadedCount > 0) {
      setSuccess(`${uploadedCount}টি ছবি সফলভাবে আপলোড হয়েছে`);
      fetchPhotos();
    } else {
      setError("আপলোড ব্যর্থ হয়েছে");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    uploadFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) uploadFiles(files);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি এই ছবি মুছে ফেলতে চান?")) return;

    const token = getToken();
    if (!token) { setError("লগইন প্রয়োজন"); return; }

    try {
      const res = await fetch(`${API}/api/photos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setSuccess("ছবি মুছে ফেলা হয়েছে");
        if (preview?.id === id) setPreview(null);
      }
    } catch {
      setError("মুছে ফেলা যায়নি");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (value: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredPhotos = filterSection ? photos.filter((p) => p.section === filterSection) : photos;

  const sectionCounts = sections.map((s) => ({
    ...s,
    count: photos.filter((p) => p.section === s.value).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            ছবি পরিচালনা
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            মোট {photos.length}টি ছবি আপলোড করা হয়েছে
          </p>
        </div>

        {/* Section filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterSection("")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              !filterSection
                ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            সব ({photos.length})
          </button>
          {sectionCounts.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterSection(filterSection === s.value ? "" : s.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                filterSection === s.value
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                  : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {s.label} ({s.count})
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Upload Section */}
      <div
        className={`bg-white rounded-xl border-2 border-dashed p-6 transition-colors dark:bg-zinc-900 ${
          dragOver
            ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
            : "border-zinc-200 dark:border-zinc-700"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            ছবি টেনে ছেড়ে দিন অথবা নির্বাচন করুন
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
            PNG, JPG, WEBP (একাধিক ছবি সমর্থিত)
          </p>

          <div className="flex items-center gap-3">
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="text-sm px-3 py-2.5 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            >
              {sections.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <label className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors shadow-sm ${
              uploading
                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {uploading ? "আপলোড হচ্ছে..." : "ছবি নির্বাচন"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-sm text-zinc-400">লোড হচ্ছে...</p>
            </div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <svg className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z" />
            </svg>
            <p className="text-sm font-medium">কোনো ছবি নেই</p>
            <p className="text-xs mt-1">উপরের বাটন থেকে ছবি আপলোড করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-all dark:bg-zinc-900 dark:border-zinc-800"
              >
                {/* Image */}
                <div
                  className="aspect-square relative cursor-pointer"
                  onClick={() => setPreview(photo)}
                >
                  <img
                    src={`${API}/api/photos/${photo.id}/file`}
                    alt={photo.filePath}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreview(photo); }}
                      className="p-2 rounded-lg bg-white/90 text-zinc-700 hover:bg-white transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                      className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {photo.filePath}
                  </p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {sections.find((s) => s.value === photo.section)?.label || photo.section}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {formatSize(photo.size)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-12 right-0 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={`${API}/api/photos/${preview.id}/file`}
              alt={preview.filePath}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />

            {/* Info bar */}
            <div className="mt-3 flex items-center justify-between text-white/80 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium text-white">{preview.filePath}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {sections.find((s) => s.value === preview.section)?.label}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs">{formatSize(preview.size)}</span>
                <span className="text-xs">{formatDate(preview.createdAt)}</span>
                <button
                  onClick={() => handleDelete(preview.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  মুছুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
