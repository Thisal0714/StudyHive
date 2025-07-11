"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/components/common/loading";

export default function Notes() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return <Loading />;
  }

  return (
    <div className="w-full px-4 py-4 sm:px-10 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Notes</h2>
          <p className="text-gray-600 mt-2">Manage your study notes</p>
        </div>
        <div className="bg-primary px-3 py-2 rounded-md text-white font-semibold hover:bg-primary transition-colors cursor-pointer">
          <button className="cursor-pointer">Upload a PDF</button>
        </div>
      </div>

      <div className="w-full h-full mx-0 sm:mx-2 bg-white rounded-md p-2 sm:p-4 shadow-md">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="w-full lg:w-2/3 bg-none rounded-md border p-2 sm:p-3">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg text-black font-bold">Your Notes</h2>
            </div>
            <div className="mt-2 sm:mt-4">
              <div className="flex flex-col sm:flex-row my-1 border px-2 sm:px-3 py-2 rounded-md">
                <div className="w-full sm:w-1/3 flex items-center">
                  <h6 className="text-sm sm:text-md text-gray-500">Test1.pdf</h6>
                </div>
                <div className="w-full sm:w-2/3 flex justify-end items-end gap-1 mt-2 sm:mt-0">
                  <button className="bg-black text-white px-3 py-2 rounded-md cursor-pointer hover:bg-white hover:text-black hover:border border transition-colors">
                    Summarize
                  </button>
                  <button className="bg-black text-white px-3 py-2 rounded-md cursor-pointer">
                    Q & A
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row my-1 border px-2 sm:px-3 py-2 rounded-md">
                <div className="w-full sm:w-1/3 flex items-center">
                  <h6 className="text-sm sm:text-md text-gray-500">Test1.pdf</h6>
                </div>
                <div className="w-full sm:w-2/3 flex justify-end items-end gap-1 mt-2 sm:mt-0">
                  <button className="bg-black text-white px-3 py-2 rounded-md cursor-pointer">
                    Summarize
                  </button>
                  <button className="bg-black text-white px-3 py-2 rounded-md cursor-pointer">
                    Q & A
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-none rounded-md border p-2 sm:p-3 mt-2 lg:mt-0">
            <h2 className="text-base sm:text-lg text-black font-bold">Summary</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
