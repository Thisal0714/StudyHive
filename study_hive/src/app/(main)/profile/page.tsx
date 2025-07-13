'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Loading from '@/app/components/common/loading';
import { getUserProfile, updateUserProfile } from '@/app/lib/api/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
 
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("loading...");
  const [, setIsAdmin] = useState(false);
  const [lastName, setLastName] = useState("loading...");
  const [email, setEmail] = useState("loading...");
  const [job, setJob] = useState("loading...");
  const [city, setCity] = useState("loading...");
  const [nic, setNic] = useState("loading...");
  const [phone, setPhone] = useState("loading...");

  const [profileData, setProfileData] = useState({
    name: "",
    lastName: "",
    email: "",
    job: "",
    city: "",
    nic: "",
    phone: "",
    password: ""
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
        setUserId(profileRes.user.id || "");
        setUserName(profileRes.user.name);
        setLastName(profileRes.user.lastName);
        setEmail(profileRes.user.email);
        setJob(profileRes.user.job);
        setCity(profileRes.user.city);
        setNic(profileRes.user.nic);
        setPhone(profileRes.user.phone);
        
        // Update profileData with the fetched data
        setProfileData({
          name: profileRes.user.name,
          lastName: profileRes.user.lastName,
          email: profileRes.user.email,
          job: profileRes.user.job,
          city: profileRes.user.city,
          nic: profileRes.user.nic,
          phone: profileRes.user.phone,
          password:""
        });
      }
    }).catch(() => {
      setUserName("loading...");
    });
  }, [router]);

  if (showLoader) {
    return <Loading />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Also update individual state variables for immediate UI updates
    switch (name) {
      case 'name':
        setUserName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'job':
        setJob(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'nic':
        setNic(value);
        break;
      case 'phone':
        setPhone(value);
        break;
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create update data without password unless it's being changed
      const updateData = {
        name: profileData.name,
        lastName: profileData.lastName,
        email: profileData.email,
        job: profileData.job,
        city: profileData.city,
        phone: profileData.phone,
        password:"",
        ...(profileData.password && profileData.password.trim() !== '' && { password: profileData.password })
      };
      
      console.log('Sending update data:', updateData); // Debug log
      
      const response = await updateUserProfile(userId, updateData);
      
      if (response.statusCode === 200) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset profileData to original values
    setProfileData({
      name: userName,
      lastName: lastName,
      email: email,
      job: job,
      city: city,
      nic: nic,
      phone: phone,
      password:""
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full px-4 py-4 sm:px-10 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="text-center">
                <div className="w-20 h-20 sm:w-32 sm:h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-2xl sm:text-4xl mx-auto mb-4">
                  {userName && userName[0]}{lastName && lastName[0]}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {userName} {lastName}
                </h3>
                <p className="text-gray-600">{email}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{job} • {city}</p>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2 mt-4 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
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
                      value={profileData.lastName}
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
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={true}
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
                    value={profileData.job}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={profileData.nic}
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
                      value={profileData.city}
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
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleCancel}
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
  );
}