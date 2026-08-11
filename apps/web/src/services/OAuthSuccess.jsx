import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Save token to store and localStorage
      localStorage.setItem("token", token);
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Processing login...</div>;
};

export default OAuthSuccess;
