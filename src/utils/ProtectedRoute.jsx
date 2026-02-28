import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const auth = useContext(AuthContext);
  const isLoggedIn =
    auth?.isLoggedIn ?? localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
