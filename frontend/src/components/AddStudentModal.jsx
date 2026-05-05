"use client";
import React, { useState } from "react";

export default function AddStudentModal({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [college, setCollege] = useState("");

  async function createStudent() {
    if (!name || !rollNo) return alert("Name and Roll No required");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch("/api/students/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ name, rollNo, college }),
    });

if (res.ok) {
  const data = await res.json();
  const student = data.student;

  window.location.href = `/dashboard/students/${student._id}/predict-cgpa`;
}
 else {
      alert("Failed to create");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded"
      >
        Add New Record
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Student — Mandatory details</h3>

            <input
              className="w-full mb-3 p-2 border"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full mb-3 p-2 border"
              placeholder="Roll No"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />

            <input
              className="w-full mb-3 p-2 border"
              placeholder="College (optional)"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={createStudent}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Create & Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
