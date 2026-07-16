"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Photo {
  id: number;
  filename: string;
  originalFilename: string;
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    fetchPhotos();
  }, [router]);

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
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try { return JSON.parse(raw).token; } catch { return null; }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) uploadedCount++;
      } catch {
        // continue with next file
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

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি এই ছবি মুছে ফেলতে চান?")) return;

    const token = getToken();
    if (!token) { setError("লগইন প্রয়োজন"); return; }

    try {
      const res = await fetch(`${API}/api/photos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setSuccess("ছবি মুছে ফেলা হয়েছে");
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

  const filteredPhotos = photos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          ছবি পরিচালনা
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          সেকশন অনুযায়ী ছবি আপলোড ও পরিচালনা করুন
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-sm dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-sm dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-sm border border-zinc-200 p-6 dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-600 mb-4 dark:text-zinc-400">
          নতুন ছবি আপলোড করুন
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-600 mb-1 dark:text-zinc-400">
              সেকশন নির্বাচন করুন
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {sections.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-600 mb-1 dark:text-zinc-400">
              ছবি নির্বাচন করুন
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-sm bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          <div className="flex items-end">
            <button
              disabled={uploading}
              className="bg-emerald-600 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "আপলোড হচ্ছে..." : "আপলোড"}
            </button>
          </div>
        </div>
      </div>

      {/* Photos List */}
      <div className="bg-white rounded-sm border border-zinc-200 p-6 dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-600 mb-4 dark:text-zinc-400">
          সকল ছবি ({photos.length})
        </h2>

        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">লোড হচ্ছে...</p>
        ) : photos.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">কোনো ছবি নেই</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                <div className="aspect-square relative">
                  <img
                    src={`${API}/api/photos/file/${photo.filename}`}
                    alt={photo.originalFilename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="bg-red-600 text-white text-xs font-semibold py-1.5 px-3 rounded-sm hover:bg-red-700 transition"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[11px] text-zinc-500 truncate dark:text-zinc-400">
                    {photo.originalFilename}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
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
    </div>
  );
}
