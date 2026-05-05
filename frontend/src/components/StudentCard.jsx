"use client";
import Link from "next/link";
import React from "react";

export default function StudentCard({ student, onRefresh }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{student.name}</div>
          <div className="text-sm text-slate-500">Roll: {student.rollNo}</div>
          <div className="text-sm text-slate-500">College: {student.college || "—"}</div>
        </div>

        <div className="flex flex-col gap-2">
          {student.status === "pending" ? (
            <Link
              href={`/dashboard/students/${student._id}/analyze-notes`}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              Analyze
            </Link>
          ) : (
            <Link
              href={`/dashboard/students/${student._id}/result`}
              className="px-3 py-1 border rounded"
            >
              View Result
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
