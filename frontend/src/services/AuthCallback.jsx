import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleAuth } = useUserStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        handleGoogleAuth(token, user);
        navigate("/home");
      } catch (err) {
        console.error("Failed to parse user from URL", err);
        navigate("/user/signin");
      }
    } else {
      navigate("/user/signin"); // fallback
    }
  }, [location, handleGoogleAuth, navigate]);

  return <div className="text-white p-6">Authenticating with Google...</div>;
};

export default AuthCallback;
