"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeaturesPage() {
  return (
    <div className="mt-20">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-100 to-indigo-100 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Powerful Features for Smarter Student Evaluation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-700 text-lg max-w-2xl mx-auto"
          >
            Explore how our AI-powered platform helps teachers analyze notes, voice inputs,
            CGPA factors, and more — making academic prediction easier than ever.
          </motion.p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">AI-Powered CGPA Prediction</h3>
            <p className="text-slate-600">
              Our machine learning model evaluates multiple academic factors to compute
              an accurate CGPA prediction for each student.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">Notes Analyzer</h3>
            <p className="text-slate-600">
              Upload handwritten or typed notes — the system extracts keywords, clarity,
              handwriting style, understanding level, and effort.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">Voice Analyzer</h3>
            <p className="text-slate-600">
              Record or upload audio answers. AI checks communication clarity, confidence,
              fluency, academic understanding & tone.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">Student Management Dashboard</h3>
            <p className="text-slate-600">
              Add, edit, delete students and track their progress through each
              prediction stage in real time.
            </p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">Smart Workflow Tracking</h3>
            <p className="text-slate-600">
              The system automatically knows which step the teacher needs to complete next.
            </p>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">Secure Data & Authentication</h3>
            <p className="text-slate-600">
              Secure login, JWT cookie authentication, protected routes, and encrypted access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LONG EXPLANATION SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-6">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-10"
          >
            Why Choose Our Platform?
          </motion.h2>

          <div className="space-y-10 text-slate-700 text-lg">
            <p>
              Our platform combines AI + real academic inputs to build the most accurate prediction system.
              Teachers can track a student’s entire academic journey in one place.
            </p>

            <p>
              It is designed for ease of use, speed, and precision. Each module — Notes Analyzer,
              Voice Analyzer, CGPA Model — works together to understand the student holistically.
            </p>

            <p>
              With modern UI, 3D animations, fast performance, and secure access, it becomes an all-in-one
              academic tool for universities, colleges, and schools.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
