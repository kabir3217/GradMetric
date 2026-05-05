"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, ChevronRight, User, School, Hash, Loader2 } from "lucide-react";

// Strict Type Definition
interface Student {
  _id: string;
  name: string;
  email?: string;
  rollNo: string;
  college: string;
  status: string; 
  cgpaPrediction: number | null;
  // Checks for data existence
  modelInputs?: any; 
  notesAnalysis?: { text?: string };
  voiceAnalysis?: { clarity?: number };
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectingId, setRedirectingId] = useState<string | null>(null);

  // Load students
  async function load() {
    try {
      const res = await fetch("/api/students/list", { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Student[] = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Delete
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    setStudents((current) => current.filter((s) => s._id !== id));
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    load();
  }

  // === SMART REDIRECT LOGIC ===
  const handleAnalyze = (student: Student) => {
    setRedirectingId(student._id); // Show loading spinner on button

    const id = student._id;
    const status = student.status || "";

    // 1. If everything is done, go to Result
    if (status === "COMPLETED" || student.cgpaPrediction) {
      router.push(`/dashboard/students/${id}/result`);
      return;
    }

    // 2. Check Input Data (CGPA Inputs)
    // If modelInputs are empty/null, they need to fill details first
    if (!student.modelInputs || Object.keys(student.modelInputs).length === 0) {
      router.push(`/dashboard/students/${id}/predict-cgpa`);
      return;
    }

    // 3. Check Notes Analysis
    // If notes text is missing, they need to upload/analyze notes
    if (!student.notesAnalysis?.text) {
      router.push(`/dashboard/students/${id}/analyze-notes`);
      return;
    }

    // 4. Check Voice Analysis
    // If voice clarity score is missing, they need to do voice analysis
    if (student.voiceAnalysis?.clarity === undefined || student.voiceAnalysis?.clarity === null) {
      router.push(`/dashboard/students/${id}/analyze-voice`);
      return;
    }

    // 5. Fallback: If all data exists but status isn't "COMPLETED", assume Result
    router.push(`/dashboard/students/${id}/result`);
  };

  useEffect(() => {
    load();
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status || "";
    if (s === "COMPLETED") return <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">Completed</span>;
    if (s.includes("PENDING")) {
        const readable = s.replace("PENDING_", "").replace("_", " ").toLowerCase(); 
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold capitalize">Pending {readable}</span>;
    }
    return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Draft</span>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-16">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Student Records</h1>
            <p className="text-slate-500">View and manage prediction status</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Prediction</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500">Loading records...</td></tr>
            ) : students.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500">No students found.</td></tr>
            ) : (
                <AnimatePresence>
                  {students.map((s) => (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <User size={18} />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800">{s.name}</div>
                                <div className="text-xs text-slate-500">{s.email || "No Email"}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs text-slate-600"><Hash size={12} /> {s.rollNo || "N/A"}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-600"><School size={12} /> {s.college || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.cgpaPrediction ? <span className="font-bold text-indigo-600 text-lg">{s.cgpaPrediction}</span> : <span className="text-slate-400 text-sm italic">--</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(s.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                        <button onClick={() => handleDelete(s._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                        
                        {/* THE SMART BUTTON */}
                        <button
                          onClick={() => handleAnalyze(s)}
                          disabled={redirectingId === s._id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-indigo-700 shadow-sm transition disabled:opacity-70 disabled:cursor-wait"
                        >
                          {redirectingId === s._id ? (
                            <>Loading <Loader2 size={14} className="animate-spin" /></>
                          ) : (
                            <>Analyze <ChevronRight size={14} /></>
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}