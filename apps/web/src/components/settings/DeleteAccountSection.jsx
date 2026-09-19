import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function DeleteAccountSection() {
  const { userData, deleteAccount } = useUserStore();
  const navigate = useNavigate();

  const [isConfirming, setIsConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const requiresPassword = Boolean(userData?.hasPassword);
  const canSubmit = confirmText === "DELETE" && (!requiresPassword || password);

  const resetForm = () => {
    setIsConfirming(false);
    setPassword("");
    setConfirmText("");
    setError("");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setIsDeleting(true);

    const result = await deleteAccount(requiresPassword ? password : undefined);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-3">
        Danger zone
      </h2>

      <div className="border border-red-200 rounded-lg p-4 dark:border-red-900/50">
        <p className="text-sm font-semibold mb-1">Delete account</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          This permanently deletes your account, notes, and collaborations. This action cannot
          be undone.
        </p>

        {!isConfirming ? (
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="px-3 py-1.5 text-sm font-semibold rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Delete account
          </button>
        ) : (
          <form onSubmit={handleDelete} className="border-t border-red-200 dark:border-red-900/50 pt-3">
            {requiresPassword && (
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">
                Type <span className="font-mono">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!canSubmit || isDeleting}
                className="px-3 py-1.5 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently delete account"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isDeleting}
                className="px-3 py-1.5 text-sm font-semibold rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
