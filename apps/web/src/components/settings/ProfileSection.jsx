import { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import useUserStore from "../../store/useUserStore";
import { updateProfile } from "../../services/api";

export default function ProfileSection() {
  const { userData, fetchUsetdata } = useUserStore();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    fetchUsetdata();
  }, [fetchUsetdata]);

  useEffect(() => {
    if (userData) {
      setName(userData.displayName || "");
      setAvatar(userData.avatar || "");
    }
  }, [userData]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus("");
    setProfileError("");
    setIsSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), avatar: avatar.trim() });
      await fetchUsetdata();
      setProfileStatus("Profile updated");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
        Profile
      </h2>

      <form
        onSubmit={handleProfileSubmit}
        className="border border-gray-200 rounded-lg p-4 dark:border-neutral-700"
      >
        <div className="flex items-center gap-3 mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-300 dark:ring-neutral-700"
            />
          ) : (
            <IoPersonCircle className="w-12 h-12 text-gray-400" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {userData?.displayName || userData?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userData?.username}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold mb-1">Avatar URL</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
          />
        </div>

        {profileError && <p className="text-red-500 text-xs mb-2">{profileError}</p>}
        {profileStatus && (
          <p className="text-green-600 dark:text-green-400 text-xs mb-2">{profileStatus}</p>
        )}

        <button
          type="submit"
          disabled={isSavingProfile}
          className="px-3 py-1.5 text-sm font-semibold rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {isSavingProfile ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
