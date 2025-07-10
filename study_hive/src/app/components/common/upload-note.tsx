"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadFile {
  name: string;
  size: number;
  progress: number;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === "application/pdf");

    const newFiles = pdfFiles.map(file => ({
      name: file.name,
      size: file.size,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prevFiles => {
          return prevFiles.map(f => {
            if (f.name === file.name) {
              const nextProgress = f.progress + 10;
              return { ...f, progress: nextProgress > 100 ? 100 : nextProgress };
            }
            return f;
          });
        });
      }, 200);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] }
  });

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(file => file.name !== name));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload PDF files</h2>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${
            isDragActive ? "border-blue-400" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <p>Drag and drop or <span className="text-blue-600 underline">browse</span> PDF files</p>
        </div>

        <div className="mt-4 space-y-4 max-h-60 overflow-auto">
          {files.map(file => (
            <div key={file.name} className="flex items-center justify-between border p-2 rounded">
              <div className="w-full pr-2">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
                <div className="w-full bg-gray-200 rounded h-2 mt-2">
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
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button className="text-blue-600">Cancel</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add files
          </button>
        </div>
      </div>
    </div>
  );
}
