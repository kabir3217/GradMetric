"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Step 1 — Add Student Details",
      desc: "Teacher enters basic information like Name, Email, Course, and Academic Year. This creates the student profile in database."
    },
    {
      title: "Step 2 — CGPA Input Form",
      desc: "Teacher enters marks, attendance, subjects, and behaviour factors. These values feed into our predictive ML model."
    },
    {
      title: "Step 3 — Notes Upload",
      desc: "Upload handwritten or typed notes. AI analyses handwriting quality, structure, keyword density, and effort scoring."
    },
    {
      title: "Step 4 — Voice Recording",
      desc: "Teacher records student answering a question or explaining a topic. AI checks fluency, clarity, tone, and subject depth."
    },
    {
      title: "Step 5 — Prediction & Report",
      desc: "All data is combined and a final CGPA prediction is generated along with a detailed performance breakdown."
    }
  ];

  return (
    <div className="mt-20 px-6 max-w-6xl mx-auto">

      {/* HERO */}
      <section className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-900"
        >
          How the Platform Works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 text-lg mt-3 max-w-2xl mx-auto"
        >
          A complete step-by-step journey of how teachers use the system to generate
          accurate academic performance predictions for students.
        </motion.p>
      </section>

      {/* WORKFLOW STEPS */}
      <section className="space-y-10">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 60 }}
            className="bg-white shadow-lg border p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-slate-600">{s.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* DEEP EXPLANATION */}
      {/* <section className="mt-24 p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Behind the Scenes — The Technology</h2>

        <div className="space-y-4 text-slate-700">
          <p>
            The system uses a combination of Python machine learning models,
            MongoDB for database storage, and Next.js for the frontend interface.
          </p>
          <p>
            Our ML models analyze textual and audio data to understand student behaviour,
            preparation, understanding, clarity, writing effort, and more.
          </p>
          <p>
            JWT-based authentication ensures privacy and secure access to teacher data.
          </p>
        </div>
      </section> */}

    </div>
  );
}
