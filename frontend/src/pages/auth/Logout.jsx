import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); // Clear all stored data
    navigate("/login"); // Redirect to login page
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
