import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export const Login = () => {
  const navigate = useNavigate();
  const urlApi = `${import.meta.env.VITE_BACKEND_URL}/api`;

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

    if (!inputData.email.trim() || !inputData.password.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`${urlApi}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: inputData.email.trim(),
          password: inputData.password
        })
      });

      if (!response.ok) {
        throw new Error('Correo o contraseña incorrectos');
      }

      const data = await response.json();
      console.log('Inicio de sesión exitoso:', data);

      if (data.user?.role !== "client") {
        alert("Estas credenciales no pertenecen a una cuenta de cliente");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/");
      return data;

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert(error.message || "Ocurrió un error inesperado");
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