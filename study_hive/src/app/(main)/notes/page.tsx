export default function Notes() {
  return (
    <div className="w-full px-10 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notes</h2>
          <p className="text-gray-600 mt-2">Manage your study notes</p>
        </div>
        <div className="bg-primary px-3 py-2 rounded-md text-white font-semibold hover:bg-primary transition-colors cursor-pointer">
          <button className="cursor-pointer">Upload a PDF</button>
        </div>
      </div>

      <div className="w-full h-full mx-2 bg-white rounded-md p-4 shadow-md">
        <div className="flex gap-2">
          <div className="w-2/3 bg-none rounded-md border p-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-black font-bold">Your Notes</h2>
            </div>
            <div className="mt-4">
              <div className="flex my-1 border px-3 py-2 rounded-md">
                <div className="w-1/3 flex items-center">
                  <h6 className="text-md text-gray-500">Test1.pdf</h6>
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

              <div className="flex my-1 border px-3 py-2 rounded-md">
                <div className="w-1/3 flex items-center">
                  <h6 className="text-md text-gray-500">Test1.pdf</h6>
                </div>
                <div className="w-2/3 flex justify-end items-end gap-1">
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
          <div className="w-1/3 bg-none rounded-md border p-3">
            <h2 className="text-lg text-black font-bold">Summary</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
