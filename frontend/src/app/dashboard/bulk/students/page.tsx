"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function Page() {
  const [tab, setTab] = useState<"create" | "delete">("create");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  const REQUIRED_FIELDS = [
    "name",
    "rollNo",
    "college",
    "Previous_Semester_GPA",
    "Midterm_Score_Average",
    "Assignment_Score_Average",
    "Twelfth_Grade_Percentage",
    "Tenth_Grade_Percentage",
    "Study_Hours_Per_Day",
    "Attendance_Percentage",
    "Number_of_Backlogs",
    "Mental_Stress_Score",
    "Distance_From_Campus_KM",
  ];

  const DELETE_FIELDS = ["rollNo"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setStatus("Reading file...");

    const buffer = await f.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    setPreview(json.slice(0, 10));
    setStatus(`Previewing ${json.length} records`);
  };

  const submit = async () => {
    if (!file) return alert("Select a CSV file");

    const formData = new FormData();
    formData.append("file", file);

    const url =
      tab === "create"
        ? "/api/bulk/students/create"
        : "/api/bulk/students/delete";

    setStatus("Uploading...");

    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      setStatus(`✅ ${data.message}`);
      setFile(null);
      setPreview([]);
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 ">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border mt-12">

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
          Bulk Student Management
        </h1>
        <p className="text-gray-600 mb-6">
          Upload CSV files to create or delete student records in bulk.
        </p>

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("create")}
            className={`px-6 py-2 rounded-full font-semibold transition
              ${tab === "create"
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Bulk Create
          </button>

          <button
            onClick={() => setTab("delete")}
            className={`px-6 py-2 rounded-full font-semibold transition
              ${tab === "delete"
                ? "bg-red-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Bulk Delete
          </button>
        </div>

        {/* FORMAT CARD */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-indigo-700 mb-2">
            Accepted CSV Columns
          </h3>

          <div className="flex flex-wrap gap-2">
            {(tab === "create" ? REQUIRED_FIELDS : DELETE_FIELDS).map((f) => (
              <span
                key={f}
                className="px-3 py-1 bg-white border rounded-full text-sm text-gray-700 shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="block mx-auto"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload CSV / Excel file only
          </p>
        </div>

        {/* PREVIEW */}
        {preview.length > 0 && (
          <div className="overflow-x-auto mb-6">
            <h3 className="font-semibold mb-2 text-gray-700">
              Preview (First 10 rows)
            </h3>
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-4 py-2 border text-sm">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-4 py-2 border text-sm">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ACTION */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">{status}</p>

          <button
            onClick={submit}
            disabled={!file}
            className={`px-8 py-3 rounded-xl font-bold text-white transition
              ${tab === "create"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"}
              disabled:opacity-50`}
          >
            {tab === "create" ? "Create Students" : "Delete Students"}
          </button>
        </div>
      </div>
    </div>
  );
}
