import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (selectedRole === "client") {
      navigate("/");
    }

    if (selectedRole === "admin") {
      navigate("/admin-shop");
    }

    if (selectedRole === "") {
      alert("Selecciona si eres cliente o administrador");
    }
  };

  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

        <form onSubmit={handleLogin}>
          <p className="fw-semibold mb-2">
            ¿Cómo deseas iniciar sesión?
          </p>

          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className={
                selectedRole === "client"
                  ? "btn btn-primary w-50"
                  : "btn btn-outline-primary w-50"
              }
              onClick={() => setSelectedRole("client")}
            >
              Cliente
            </button>

            <button
              type="button"
              className={
                selectedRole === "admin"
                  ? "btn btn-dark w-50"
                  : "btn btn-outline-dark w-50"
              }
              onClick={() => setSelectedRole("admin")}
            >
              Administrador
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>

          <div className="text-center mt-4">
            <span className="text-muted">
              ¿No estás registrado?{" "}
            </span>

            <Link
              to="/register"
              className="text-decoration-none fw-semibold"
            >
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};