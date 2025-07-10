"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/app/lib/config";
import UploadPage from "@/app/components/common/upload-note";

interface Note {
  filename: string;
  contentType: string;
}

export default function Notes() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showUpload, setShowUpload] = useState(false);

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

  return (
    <div className="w-full px-10 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notes</h2>
          <p className="text-gray-600 mt-2">Manage your study notes</p>
        </div>
        <div className="bg-primary px-3 py-2 rounded-md text-white font-semibold hover:bg-primary transition-colors cursor-pointer">
          <button className="cursor-pointer" onClick={() =>setShowUpload(true)}>Upload a PDF</button>
          {showUpload && <UploadPage />}
        </div>
      </div>

      <div className="w-full h-full mx-2 bg-white rounded-md p-4 shadow-md">
        <div className="flex gap-2">
          <div className="w-2/3 bg-none rounded-md border p-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-black font-bold">Your Notes</h2>
            </div>
            <div className="mt-4">
              {notes.length === 0 ? (
                <p className="text-gray-500">No notes uploaded yet.</p>
              ) : (
                notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex my-1 border px-3 py-2 rounded-md"
                  >
                    <div className="w-1/3 flex items-center">
                      <h6 className="text-md text-gray-500">{note.filename}</h6>
                    </div>
                    <div className="w-2/3 flex justify-end items-end gap-1">
                      <button className="bg-black text-white px-3 py-2 rounded-md cursor-pointer hover:bg-white hover:text-black hover:border border transition-colors">
                        Summarize
                      </button>
                      <button className="bg-black text-white px-3 py-2 rounded-md cursor-pointer">
                        Q & A
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="w-1/3 bg-none rounded-md border p-3">
            <h2 className="text-lg text-black font-bold">Summary</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
