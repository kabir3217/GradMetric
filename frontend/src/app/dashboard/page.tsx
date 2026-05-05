"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddStudentModal from "@/components/AddStudentModal";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  UserCheck,
  NotebookPen,
  Mic,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const steps = [
    { label: "Mandatory Details", icon: UserCheck },
    { label: "CGPA Inputs", icon: BrainCircuit },
    { label: "Notes", icon: NotebookPen },
    { label: "Voice Analysis", icon: Mic },
    { label: "Result", icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 mt-16">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">
            Teacher Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your students and track the CGPA prediction workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddStudentModal onCreated={() => {}} />

          <Link
            href="/dashboard/students"
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-lg transition"
          >
            View Records
          </Link>

          <Link
            href="/dashboard/bulk/students"
            className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 shadow-lg transition"
          >
            Bulk Create/Delete
          </Link>
        </div>
      </header>

      {/*
            FLOWCHART 3D Steps Section
           */}
      <section className="relative mt-16 mb-20">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          Workflow Progress
        </h2>

        <div className="flex flex-col md:flex-row items-center md:justify-between gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.25, type: "spring" }}
              className="group flex flex-col items-center text-center"
            >
              {/* 3D Card */}
              <div className="bg-white rounded-2xl p-8 w-48 shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-slate-200 
                hover:-translate-y-3 hover:scale-[1.03] hover:border-blue-400"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  whileHover={{ rotateX: 10, rotateY: -10 }}
                  transition={{ type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <step.icon className="h-10 w-10 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-slate-800">{step.label}</h3>
                </motion.div>
              </div>

              {/* Connector Line */}
              {i !== steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.3 + 0.3 }}
                  className="hidden md:block h-1 bg-blue-300 rounded-full w-32 mx-4"
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================
            ANIMATED INFORMATION BLOCKS
          ============================ */}
      <section className="mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Analytics Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              Student Distribution
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Track your active, pending, and completed student workflows. 
              This helps you understand how many students are moving through 
              the CGPA prediction pipeline.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              Prediction Accuracy
            </h3>
            <p className="text-slate-600 leading-relaxed">
              The advanced ML model analyzes multiple parameters including 
              notes, voice clarity, and CGPA trends to make accurate predictions.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              System Automation
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Automated OCR, speech analysis, and structured student profiling 
              reduce manual work and ensure a faster evaluation cycle.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              AI Insights
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Gain deeper insights into student learning patterns with AI-powered 
              analysis, ensuring personalized guidance and improved performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================
            EXTRA LONG ENGAGING SECTION
          ============================ */}
      <section className="mt-28 mb-20">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Why This Dashboard?</h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-slate-700 text-lg leading-relaxed max-w-3xl"
        >
          This dashboard is built to be extremely engaging, visually meaningful, 
          and intuitive. Every animated step represents a clear flow of CGPA analysis. 
          The visually appealing blocks below help you understand how data flows and 
          how students progress through each stage.
        </motion.p>
      </section>
      {/* ============================
      BEAUTIFUL ANIMATED INFO CARDS  
      (Floating, sliding in multiple directions)
  ============================ */}

<section className="mt-20 relative">
  <h2 className="text-2xl font-bold text-slate-800 mb-10">
    What Makes This Platform Powerful?
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {/* Card 1 — slide from left */}
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 60, duration: 0.8 }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all"
    >
      <h3 className="font-bold text-xl mb-2 text-blue-600">Smart AI Engine</h3>
      <p className="text-slate-700">
        AI models evaluate student patterns from notes, voice, CGPA and generate
        adaptive prediction with advanced ML accuracy.
      </p>
    </motion.div>

    {/* Card 2 — slide from bottom */}
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 50, duration: 0.9 }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all"
    >
      <h3 className="font-bold text-xl mb-2 text-indigo-600">Automated Workflow</h3>
      <p className="text-slate-700">
        The complete pipeline—OCR, speech-to-text, student profiling—
        runs automatically with minimal human work required.
      </p>
    </motion.div>

    {/* Card 3 — slide from right */}
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 60, duration: 0.8 }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all"
    >
      <h3 className="font-bold text-xl mb-2 text-purple-600">Beautiful Interactions</h3>
      <p className="text-slate-700">
        Smooth animations, 3D-inspired UI, and interactive cards ensure
        the teacher stays engaged throughout the dashboard.
      </p>
    </motion.div>

    {/* Card 4 — slide from top */}
    <motion.div
      initial={{ opacity: 0, y: -90 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 50, duration: 0.9 }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-rose-50 to-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all"
    >
      <h3 className="font-bold text-xl mb-2 text-rose-600">Secure Storage</h3>
      <p className="text-slate-700">
        Each student's data is safely stored, encrypted, and instantly accessible
        for evaluations and progress tracking.
      </p>
    </motion.div>

    {/* Card 5 — floating animation */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ y: [0, -10, 0] }}
      transition={{  duration: 4, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all"
    >
      <h3 className="font-bold text-xl mb-2 text-orange-600">Live Progress Tracking</h3>
      <p className="text-slate-700">
        Track each student’s stage in the CGPA prediction journey—complete visibility
        from start to finish.
      </p>
    </motion.div>

    {/* Card 6 — diagonal slide */}
    <motion.div
      initial={{ opacity: 0, x: 80, y: 80 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 55, duration: 1 }}
      viewport={{ once: true }}
      className="p-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all"
    >
      <h3 className="font-bold text-xl mb-2 text-teal-600">Cleaner Insights</h3>
      <p className="text-slate-700">
        The dashboard gives deep learning insights, making teachers’ decision-making
        faster and more accurate.
      </p>
    </motion.div>
  </div>
</section>



    </div>
    
  );
}
