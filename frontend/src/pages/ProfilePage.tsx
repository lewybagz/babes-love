import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="text-center py-8 dark:text-white">Loading profile...</div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 dark:text-white">Profile not found</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Your Profile</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="mb-2 dark:text-gray-300">
          <strong>Name:</strong> {profile.firstName} {profile.lastName}
        </p>
        <p className="mb-2 dark:text-gray-300">
          <strong>Email:</strong> {profile.email}
        </p>
        <p className="mb-4 dark:text-gray-300">
          <strong>Account Type:</strong>{" "}
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        </p>
        <p className="mb-4 dark:text-gray-300">
          <strong>Member Since:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        {/* Add more profile details here as needed */}
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
