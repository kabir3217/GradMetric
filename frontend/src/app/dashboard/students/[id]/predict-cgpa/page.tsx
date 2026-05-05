"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
export default function PredictCGPA() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    Previous_Semester_GPA: "",
    Midterm_Score_Average: "",
    Assignment_Score_Average: "",
    Twelfth_Grade_Percentage: "",
    Tenth_Grade_Percentage: "",
    Study_Hours_Per_Day: "",
    Attendance_Percentage: "",
    Number_of_Backlogs: "",
    Mental_Stress_Score: "",
    Distance_From_Campus_KM: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  async function submitInputs() {
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`/api/students/${id}/predict-cgpa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inputs),
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/dashboard/students/${id}/analyze-notes`);
    } else {
      alert("Failed to save academic inputs");
    }
  }

  return (
    <div className="mt-20 max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
           {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-1"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 tracking-wide">
        Academic Inputs
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {Object.keys(inputs).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              {key.replace(/_/g, " ")}
            </label>
            <input
              name={key}
              placeholder={key.replace(/_/g, " ")}
              value={inputs[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        onClick={submitInputs}
        className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold rounded-xl shadow-md"
      >
        Save & Next
      </button>
    </div>
  );
}