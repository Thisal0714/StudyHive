'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Loading from '@/app/components/common/loading';
import { getUserProfile } from '@/app/lib/api/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
 
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();
  const [userName, setUserName] = useState("loading...");
  const [, setIsAdmin] = useState(false);
  const [lastName, setLastName] = useState("loading...");
  const [email, setEmail] = useState("loading...");
  const [job, setJob] = useState("loading...");
  const [city, setCity] = useState("loading...");
  const [nic, setNic] = useState("loading...");
  const [phone, setPhone] = useState("loading...");

  const [profileData, setProfileData] = useState({
    firstName: userName,
    lastName: lastName,
    email: email,
    job: job,
    city: city,
    nic: nic,
    phone: phone
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cookiesArr = document.cookie.split(';');
    const roleCookie = cookiesArr.find(cookie => cookie.trim().startsWith('role='));
    const role = roleCookie ? roleCookie.split('=')[1] : null;
    if (!role || role === "GUEST") {
      router.replace("/unauthorized");
      return;
    }
    setIsAdmin(role.toLowerCase() === 'admin');

    getUserProfile().then(profileRes => {
      if (profileRes.user ) {
        setUserName(profileRes.user.name);
        setLastName(profileRes.user.lastName);
        setEmail(profileRes.user.email);
        setJob(profileRes.user.job);
        setCity(profileRes.user.city);
        setNic(profileRes.user.nic);
        setPhone(profileRes.user.phone);
      }
    }).catch(() => {
      setUserName("loading...");
    });
  }, [router]);

  if (showLoader) {
    return <Loading />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-4xl mx-auto mb-4">
                  {userName && userName[0]}{lastName && lastName[0]}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {userName} {lastName}
                </h3>
                <p className="text-gray-600">{email}</p>
                <p className="text-sm text-gray-500 mt-1">{job} • {city}</p>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={userName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job
                  </label>
                  <input
                    type="text"
                    name="job"
                    value={job}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={nic}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    >
                    </input>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}