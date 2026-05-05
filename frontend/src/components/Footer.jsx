"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-32 bg-gradient-to-r from-blue-50 to-indigo-50 py-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-slate-800 mb-2"
        >
          CGPA Prediction Platform
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-slate-600 mb-6"
        >
          Designed with ❤️ for teachers & academic excellence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-sm text-slate-500"
        >
          © {new Date().getFullYear()} • All Rights Reserved
        </motion.div>

      </div>
    </footer>
  );
}
