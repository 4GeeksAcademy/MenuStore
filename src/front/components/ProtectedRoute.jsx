import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch (error) {
    console.error(
      "El usuario guardado no es válido:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role === "admin") {
    return (
      <Navigate
        to="/admin-shop"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;