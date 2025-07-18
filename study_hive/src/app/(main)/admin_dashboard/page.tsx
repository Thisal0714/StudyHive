"use client";

import { User } from "@/app/lib/types";
import { getAllUsers } from "@/app/lib/api/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/app/components/common/loading";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        console.log("API Response:", response); 

        if (response.ourUsersList && Array.isArray(response.ourUsersList)) {
          setUsers(response.ourUsersList);
        } else if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.user && Array.isArray(response.user)) {
          setUsers(response.user);
        } else if (Array.isArray(response)) {
          setUsers(response);
        } else {
          console.error("Unexpected response structure:", response);
          setError("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white py-4 px-4 sm:py-6 sm:px-8 shadow">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex-1 p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Welcome, Admin!
        </h2>
        <p className="text-black mb-6 sm:mb-8">
          Here&apos;s a detailed overview of the system, users and their activities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 border-l-4 border-indigo-600">
            <h3 className="text-base sm:text-lg font-semibold text-gray-600">Total Users</h3>
            <p className="text-2xl sm:text-4xl font-bold text-indigo-700">
              {loading ? "..." : users.length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 border-l-4 border-green-600">
            <h3 className="text-base sm:text-lg font-semibold text-gray-600">
              Average Rating
            </h3>
            <p className="text-2xl sm:text-4xl font-bold text-green-700">5.0</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 border-l-4 border-yellow-500">
            <h3 className="text-base sm:text-lg font-semibold text-gray-600">
              Recent Signups
            </h3>
            <p className="text-2xl sm:text-4xl font-bold text-yellow-600">
              {loading ? "..." : users.length}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800">User List</h3>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader />
              </div>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : users.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {users.map((user) => (
                  <li key={user.id}>
                    {user.name} {user.lastName} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow rounded-lg flex items-center justify-center p-4 sm:p-6 mt-4 lg:mt-0">
            <img
              src="/images/boy-is-shopping-online.svg"
              alt="Boy Shopping Online"
              className="w-full max-w-xs md:max-w-sm object-contain"
            />
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 mt-4 lg:mt-0">
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800">
              Compose Mail
            </h3>
            <textarea
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
              rows={6}
            ></textarea>
            <button
              className="bg-indigo-700 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors"
              onClick={() => {
                toast.warning("Feature is under development");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
