import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchLogin } from "../fetch.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {
  const navigate = useNavigate();

  const { dispatch } = useGlobalReducer();

  const [inputData, setInputData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (
      !inputData.email.trim() ||
      !inputData.password.trim()
    ) {
      toast.warn("Por favor completa todos los campos");
      return;
    }

    try {
      const data = await fetchLogin({
        email: inputData.email.trim(),
        password: inputData.password
      });

      // Esta página es solamente para clientes
      if (data.user?.role !== "client") {
        toast.error(
          "Estas credenciales no pertenecen a una cuenta de cliente"
        );
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      toast.error(
        error.message ||
        "Correo o contraseña incorrectos"
      );
    }
  };

  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ width: "360px" }}
      >
        <h3 className="text-center mb-2">
          Iniciar sesión
        </h3>

        <p className="text-center text-muted mb-4">
          Acceso para clientes
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">
              Correo electrónico
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo electrónico"
              name="email"
              value={inputData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              Contraseña
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              name="password"
              value={inputData.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Ingresar como cliente
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

          <div className="text-center mt-3">
            <Link
              to="/admin-login"
              className="text-decoration-none text-secondary"
            >
              Acceso para administrador
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};