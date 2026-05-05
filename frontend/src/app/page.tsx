"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import BubbleBackground from "@/components/BubbleBackground";

import {
  Sparkles,
  Zap,
  Target,
  PieChart,
  FileText,
  Mic,
  Database,
  CheckSquare,
  Settings,
  Users,
  Eye,
  Code,
  Server,
} from "lucide-react";

const floatingTransition = {
  duration: 4,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

const challengeFeatures = [
  { icon: Zap, title: "Holistic Assessment", description: "Analyze notes, voice, and academic score to build a complete performance profile." },
  { icon: Target, title: "Early Intervention", description: "Spot weak areas early and guide students before final exams." },
  { icon: PieChart, title: "Resource Optimization", description: "Help teachers save effort by focusing on high-impact students." },
];

const howItWorksSteps = [
  { icon: FileText, title: "Notes Analysis", detail: "Reads depth & clarity from written/typed assignments." },
  { icon: Mic, title: "Voice Analysis", detail: "Analyzes presentation skills, tone & clarity." },
  { icon: Database, title: "Core Metrics", detail: "Uses grades, attendance & historical performance." },
  { icon: CheckSquare, title: "Predictive CGPA", detail: "Produces the final CGPA forecast with accuracy." },
];

const teacherBenefits = [
  { icon: Settings, title: "Simple Data Entry", detail: "Add student records quickly using our modal form." },
  { icon: Users, title: "Organized Student Profiles", detail: "View sorted & detailed tables of all students." },
  { icon: Eye, title: "Explainable AI", detail: "Understand WHY every CGPA was predicted." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-36 pb-28 overflow-hidden">

        {/* BUBBLES ADDED HERE */}
        <BubbleBackground />

        {/* 3D R3F Sphere */}
        {/* <div className="absolute inset-0 opacity-60">
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.8} />
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
              <Sphere args={[1, 64, 64]}>
                <MeshDistortMaterial color="#6366f1" distort={0.3} speed={1.5} />
              </Sphere>
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div> */}

        {/* Soft moving glow blobs */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={floatingTransition}
          className="absolute top-16 right-24 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={floatingTransition}
          className="absolute bottom-10 left-20 w-48 h-48 bg-purple-300 rounded-full blur-3xl opacity-40"
        />

        {/* HERO CONTENT */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-7xl font-extrabold text-gray-900"
          >
            Academic Success{" "}
            <span className="text-indigo-600">Forecaster</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto"
          >
            Predict CGPA using advanced multimodal AI — notes, voice, and performance metrics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/auth/teacher/login"
              className="inline-flex items-center px-8 py-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Teacher Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------
        SECTION 1 — Engaging Animated Cards
      ------------------------------------------------------------ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800">
          Why CGPA Prediction Matters
        </h2>

        <p className="text-center text-lg mt-4 max-w-3xl mx-auto text-gray-600">
          Traditional reports only show scores — our AI reveals <b>potential</b>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {challengeFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all border"
            >
              <f.icon className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------
        SECTION 2 — Animated Flowchart
      ------------------------------------------------------------ */}
      <section className="py-20 bg-white px-6">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800">
          How the AI Works
        </h2>

        <p className="text-center text-lg mt-4 max-w-3xl mx-auto text-gray-600">
          A multimodal engine combining text, voice & academics.
        </p>

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-10 max-w-6xl mx-auto">
          {howItWorksSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 }}
              viewport={{ once: true }}
              className="text-center flex-1"
            >
              <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center shadow-md border">
                <step.icon className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-bold text-xl mt-4">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------
        SECTION 3 — Animated Benefit Cards
      ------------------------------------------------------------ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800">
          Tools Designed for Teachers
        </h2>

        <p className="text-center text-lg text-gray-600 mt-4">
          Intuitive dashboard + detailed analytics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {teacherBenefits.map((b, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex p-6 bg-white border rounded-2xl shadow-md"
            >
              <b.icon className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">{b.title}</h3>
                <p className="text-gray-600 mt-2">{b.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------
        FOOTER
      ------------------------------------------------------------ */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-indigo-400 text-3xl font-bold">
            Built for Performance & Reliability
          </h2>

          <p className="mt-4 text-gray-400">
            Crafted with cutting-edge technologies to ensure accuracy and speed.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 mt-10">
          <div className="text-center">
            <Code className="w-10 h-10 mx-auto text-indigo-300" />
            <div className="font-semibold">Next.js & React</div>
          </div>
          <div className="text-center">
            <Server className="w-10 h-10 mx-auto text-indigo-300" />
            <div className="font-semibold">Python AI Backend</div>
          </div>
          <div className="text-center">
            <Database className="w-10 h-10 mx-auto text-indigo-300" />
            <div className="font-semibold">Secure DB</div>
          </div>
        </div>

     
      </footer>
    </div>
  );
}
