"use client";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/lib/api/user";
import { useRouter } from "next/navigation";
import { RightArrowIcon } from "@/app/util/icons";

export default function Dashboard() {
  const [userName, setUserName] = useState("loading...");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check role from cookies
    const cookiesArr = document.cookie.split(';');
    const roleCookie = cookiesArr.find(cookie => cookie.trim().startsWith('role='));
    const role = roleCookie ? roleCookie.split('=')[1] : null;
    if (!role || role === "GUEST") {
      router.replace("/unauthorized");
      return;
    }
    setIsAdmin(role.toLowerCase() === 'admin');

    // Fetch user profile directly
    getUserProfile().then(profileRes => {
      if (profileRes.user && profileRes.user.name) {
        setUserName(profileRes.user.name);
      }
    }).catch(() => {
      setUserName("loading...");
    });
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome {userName}!</h2>
          <p className="text-gray-600 mt-2">
            Continue your study journey with StudyHive
          </p>
        </div>
        {isAdmin && (
          <button className="flex items-center gap-2 bg-danger text-white px-6 py-2 rounded-lg hover:bg-none cursor-pointer font-bold text-lg">
            Admin Dashboard
            <RightArrowIcon className="w-6 h-6"/>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total Notes
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Recent Activity
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Study Sessions
          </h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Note
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Start Study Session
          </button>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            View All Notes
          </button>
        </div>
      </div>
    </div>
  );
}
