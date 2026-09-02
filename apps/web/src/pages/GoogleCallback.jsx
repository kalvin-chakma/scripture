import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const GoogleCallback = () => {
  document.title = "Scripture | Signing in with Google";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      const oauthError = searchParams.get("error");
      if (oauthError) {
        setError("Google sign-in was cancelled or denied.");
        return;
      }

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const expectedState = sessionStorage.getItem("google_oauth_state");
      sessionStorage.removeItem("google_oauth_state");

      if (!code || !state || state !== expectedState) {
        setError("Invalid Google sign-in response. Please try again.");
        return;
      }

      const result = await useUserStore.getState().googleSignInCallback(code);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Google sign-in failed. Please try again.");
      }
    };

    run();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-full bg-black flex items-center justify-center px-4">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/user/signin")}
              className="mt-4 text-sm text-white underline hover:no-underline"
            >
              Back to sign in
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-400">Signing you in with Google...</p>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
