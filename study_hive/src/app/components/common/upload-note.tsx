"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { API_BASE_URL } from "@/app/lib/config";
import { toast } from "sonner";

interface UploadFile {
  name: string;
  size: number;
  progress: number;
  file: File; // Store the actual File object
}

interface UploadNoteProps {
  onClose: () => void;
}

export default function UploadNote({ onClose }: UploadNoteProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );
    const newFiles = pdfFiles.map((file) => ({
      name: file.name,
      size: file.size,
      progress: 0,
      file, 
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.name === file.name
              ? { ...f, progress: Math.min(progress, 100) }
              : f
          )
        );
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  // Helper to get email from cookies
  function getEmailFromCookies() {
    const match = document.cookie.match(/email=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  }

  // Upload handler
  const handleUpload = async () => {
    if (files.length === 0) return;

    const email = getEmailFromCookies();
    if (!email) {
      alert("Email not found in cookies.");
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file.file); // Use the File object
      formData.append("email", email);

      try {
        const res = await fetch(`${API_BASE_URL}/notes/file-upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        toast.success("Uploaded Successfully.");
        window.location.reload();
      } catch {
        toast.error("Upload failed for " + file.name);
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl p-10 max-w-2xl w-full relative shadow-2xl overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
              Upload PDF files
            </h2>
            <div
              {...getRootProps()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center cursor-pointer overflow-hidden transition-colors duration-200 ${
                isDragActive
                  ? "border-blue-500 bg-none"
                  : "border-gray-300 bg-none"
              }`}
            >
              <input {...getInputProps()} className="relative z-10" />

              <img
                src="/images/upload-icon.gif"
                alt="Verified User"
                className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40"
              />
              <p className="text-base text-gray-800 relative z-10">
                Drag & drop your PDF files here
              </p>
              <p className="text-sm text-gray-600 mt-1 relative z-10">
                or <span className="text-blue-600 underline">browse</span> to
                select files
              </p>
            </div>
            <div className="mt-6 space-y-3 max-h-72 overflow-y-auto">
              {files.map((file) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-between items-center border p-3 rounded-md bg-white shadow"
                >
                  <div className="w-full pr-4">
                    <p className="font-medium text-black">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          file.progress < 100 ? "bg-blue-500" : "bg-green-500"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                    {file.progress < 100 ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {file.progress}% uploading...
                      </p>
                    ) : (
                      <p className="text-xs text-green-600 mt-1">
                        Upload complete
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-gray-500 hover:text-red-600 text-4xl mx-2"
                    title="Remove"
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="text-blue-600 border px-4 rounded-md cursor-pointer hover:bg-blue-500 hover:text-white hover:border-blue-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 border cursor-pointer text-white px-5 py-2 rounded-md hover:bg-white hover:text-blue-500 hover:border-blue-500 transition"
                onClick={handleUpload}
              >
                Add files
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

