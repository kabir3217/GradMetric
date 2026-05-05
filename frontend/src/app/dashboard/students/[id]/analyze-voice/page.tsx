"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AnalyzeVoicePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitVoice(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Add audio file (mp3)");

    // File type validation
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "mp3") return alert("Only MP3 format allowed");

    // Size validation (1 MB)
    // if (file.size > 1 * 1024 * 1024) return alert("Max file size is 1MB");

    setIsLoading(true);

    const fd = new FormData();
    fd.append("file", file);

    const token = localStorage.getItem("token") || "";

    const res = await fetch(`/api/analyze/voice?studentId=${id}`, {
      method: "POST",
      body: fd,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      router.push(`/dashboard/students/${id}/result`);
    } else {
      const j = await res.json();
      alert(j.message || "Voice analysis failed");
    }

    setIsLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-lg mt-32">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-1"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 tracking-wide">
        Analyze Voice
      </h2>

      <form onSubmit={submitVoice} className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Audio File
          </label>

          {/* Warning Line */}
          <p className="text-red-600 font-semibold flex items-center gap-1 text-sm mb-3">
            ⚠️ Only MP3 allowed • Max size: 1MB
          </p>

          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 p-3 rounded-xl cursor-pointer shadow-sm bg-gray-50 
                       focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 text-white font-semibold rounded-xl shadow-md transition ${
            isLoading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>
    </div>
  );
}
