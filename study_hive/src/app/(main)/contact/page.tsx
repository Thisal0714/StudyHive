"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        className="flex flex-col md:flex-row w-full bg-blue-100 rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Left side: Contact info */}
        <motion.div
          className="flex-1 p-12 pt-20 max-w-xl md:mr-8"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
          {/* Inspirational Quote */}
          <div className="mb-8">
            <blockquote className="italic text-xl text-blue-800 border-l-4 border-blue-400 pl-4">
              &quot;Empowering your learning journey, one question at a time.&quot;
            </blockquote>
          </div>
          <p className="mb-6 text-gray-800">
            We’re here to help and answer any questions you might have. We look
            forward to hearing from you!
          </p>
          <div className="space-y-4 text-gray-700">
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: "#e2e8f0" }}
              className="flex items-center gap-2 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              📍 Eheliyagoda, Rathnapura
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: "#e2e8f0" }}
              className="flex items-center gap-2 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              📞 +94 71 366 8901
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: "#e2e8f0" }}
              className="flex items-center gap-2 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              ✉️{" "}
              <a
                href="mailto:studyhive.help@gmail.com"
                className="text-blue-600 hover:underline"
              >
                studyhive.help@gmail.com
              </a>
            </motion.div>
          </div>
          {/* Social Media Icons */}
          <div className="flex gap-4 mt-8">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors text-2xl">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors text-2xl">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition-colors text-2xl">
              <FaInstagram />
            </a>
          </div>
        </motion.div>

        {/* Right side: Illustration */}
        <motion.div
          className="flex-1 flex items-center justify-center bg-blue-50 p-8"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Image
              src="/images/hello-illustration.svg"
              alt="Hello"
              width={500}
              height={500}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
