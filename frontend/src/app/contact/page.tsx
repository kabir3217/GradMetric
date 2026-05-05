"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Update state when user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Send data to our new API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800"
        >
          Contact Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 mt-3 max-w-2xl mx-auto"
        >
          Have questions, issues, or want help getting started?  
          We’re here to support teachers & institutions using the CGPA Prediction System.
        </motion.p>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="yourname@example.com"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subject
              </label>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What is your query about?"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-center font-semibold mt-4"
              >
                ✅ Your message has been sent! We’ll get back to you shortly.
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Decorative animated bubbles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}