export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-6 px-8 shadow">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Welcome */}
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Welcome, Admin!
        </h2>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Users
            </h3>
            <p className="text-4xl font-bold text-indigo-700">80</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-600">
              Average Rating
            </h3>
            <p className="text-4xl font-bold text-green-700">5.0</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-600">
              Recent Signups
            </h3>
            <p className="text-4xl font-bold text-yellow-600">0</p>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">User List</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>John Doe</li>
              <li>Jane Smith</li>
              <li>Michael Johnson</li>
              <li>Emily Davis</li>
              <li>David Wilson</li>
            </ul>
          </div>

          {/* Beautiful SVG Image */}
          <div className="bg-white shadow rounded-lg flex items-center justify-center p-6">
            <img
              src="/images/boy-is-shopping-online.svg"
              alt="Boy Shopping Online"
              className="w-full max-w-xs md:max-w-sm object-contain"
            />
          </div>

          {/* Compose Mail */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Compose Mail</h3>
            <textarea
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={6}
            ></textarea>
            <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
