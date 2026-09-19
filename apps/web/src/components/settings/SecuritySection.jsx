import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import { changePassword } from "../../services/api";
import DeleteAccountSection from "./DeleteAccountSection";

export default function SecuritySection() {
  const { userData } = useUserStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordStatus("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <>
      {userData?.hasPassword ? (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            Change password
          </h2>

          <form
            onSubmit={handlePasswordSubmit}
            className="border border-gray-200 rounded-lg p-4 dark:border-neutral-700"
          >
            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {passwordError && <p className="text-red-500 text-xs mb-2">{passwordError}</p>}
            {passwordStatus && (
              <p className="text-green-600 dark:text-green-400 text-xs mb-2">{passwordStatus}</p>
            )}

            <button
              type="submit"
              disabled={isSavingPassword}
              className="px-3 py-1.5 text-sm font-semibold rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {isSavingPassword ? "Saving..." : "Update password"}
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            Change password
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 dark:border-neutral-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your account signs in through a third-party provider, so there's no password to
              change here.
            </p>
          </div>
        </div>
      )}

      <DeleteAccountSection />
    </>
  );
}
