"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/app/lib/config";
import UploadNote from "@/app/components/common/upload-note";
import Loader from "@/app/components/common/summary-loading";

interface Note {
  filename: string;
  contentType: string;
}

export default function Notes() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentSummaryFile, setCurrentSummaryFile] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const cookiesArr = document.cookie.split(";");
    const roleCookie = cookiesArr.find((cookie) =>
      cookie.trim().startsWith("role=")
    );
    const emailCookie = cookiesArr.find((cookie) =>
      cookie.trim().startsWith("email=")
    );

    const role = roleCookie ? roleCookie.split("=")[1].trim() : null;
    const email = emailCookie ? emailCookie.split("=")[1].trim() : null;

    if (!role || role === "GUEST" || !email) {
      router.replace("/unauthorized");
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/notes/get-note-by-email/${email}`
        );
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data);
        toast.success("Notes fetched successfully.");
      } catch {
        toast.error("No notes uploaded.");
      }
    };

    fetchNotes();
  }, [router]);

  const handleSummarize = async (filename: string) => {
    try {
      setIsSummarizing(true);
      toast.info(`Summarizing ${filename}...`);
      const res = await fetch(
        `${API_BASE_URL}/notes/summarise/${filename}`,
        { method: "GET" }
      );

      if (!res.ok) throw new Error("Failed to summarize");

      const data = await res.text();  
      setSummary(data);
      setCurrentSummaryFile(filename);

      toast.success(`Summary ready for ${filename}!`);
    } catch {
      toast.error(`Failed to summarize ${filename}.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleQA = () => {
    toast.success("Q & A is under development. Will be available soon.");
  }

  return (
    <div className="w-full px-4 py-4 sm:px-10 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Notes</h2>
          <p className="text-gray-600 mt-2">Manage your study notes</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-primary px-4 py-2 rounded-md text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          Upload a PDF
        </button>
        {showUpload && <UploadNote onClose={() => setShowUpload(false)} />}
      </div>

      <div className="w-full h-full mx-2 bg-white rounded-md p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3 rounded-md border p-3 mb-4 md:mb-0">
            <h2 className="text-lg text-black font-bold">Your Notes</h2>
            <div className="mt-4">
              {notes.length === 0 ? (
                <p className="text-gray-500">No notes uploaded yet.</p>
              ) : (
                notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row my-1 border px-3 py-2 rounded-md gap-2 sm:gap-0"
                  >
                    <div className="w-full sm:w-1/3 flex items-center">
                      <h6 className="text-md text-gray-500 break-all">
                        {note.filename}
                      </h6>
                    </div>
                    <div className="w-full sm:w-2/3 flex flex-col sm:flex-row justify-end items-end gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleSummarize(note.filename)}
                        className="bg-black text-white px-3 py-2 rounded hover:bg-white hover:text-black hover:border border transition-colors w-full sm:w-auto cursor-pointer"
                      >
                        Summarize
                      </button>
                      <button className="bg-black text-white px-3 py-2 rounded w-full sm:w-auto hover:bg-white hover:text-black hover:border border transition-colors cursor-pointer"
                      onClick={handleQA}
                      >
                        Q & A
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3 rounded-md border p-3">
            <h2 className="text-lg text-black font-bold mb-2">Summary</h2>
            {currentSummaryFile && (
              <p className="text-sm text-gray-600 mb-2">
                Summarized from:{" "}
                <span className="font-bold text-black">{currentSummaryFile}</span>
              </p>
            )}
            {isSummarizing ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Loader />
                <p className="text-gray-600 text-center">Generating summary...</p>
              </div>
            ) : (
              <p className="break-words whitespace-pre-line min-h-[40px] font-bold text-gray-800">
                {summary || "No summary yet. Click 'Summarize' on a note."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
