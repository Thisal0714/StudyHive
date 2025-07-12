"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadFile {
  name: string;
  size: number;
  progress: number;
}

interface UploadNoteProps {
  onClose: () => void;
}

export default function UploadNote({ onClose }: UploadNoteProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === "application/pdf");
    const newFiles = pdfFiles.map(file => ({
      name: file.name,
      size: file.size,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
  });

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(file => file.name !== name));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-6 text-black">
          Upload PDF files
        </h2>

        {/* Drop Area */}
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
            />
          </svg>
          <p className="text-sm text-gray-600">
            Drag & drop your PDF files here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or <span className="text-blue-600 underline">browse</span> to select files
          </p>
        </div>

        {/* File List */}
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
          {files.map(file => (
            <div
              key={file.name}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div className="w-full pr-2">
                <p className="font-medium text-black">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {Math.round(file.size / 1024)} KB
                </p>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div
                    className={`h-2 rounded ${file.progress < 100 ? "bg-blue-500" : "bg-green-500"}`}
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
                {file.progress < 100 ? (
                  <p className="text-xs text-gray-500">{file.progress}% done</p>
                ) : (
                  <p className="text-xs text-green-600">Upload complete</p>
                )}
              </div>
              <button
                onClick={() => removeFile(file.name)}
                className="text-gray-500 hover:text-red-500"
                title="Remove"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="text-blue-600 hover:underline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              // TODO: Add real upload submit logic
              console.log("Files submitted:", files);
              onClose();
            }}
          >
            Add files
          </button>
        </div>
      </div>
    </div>
  );
}