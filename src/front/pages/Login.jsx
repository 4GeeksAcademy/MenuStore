import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { fetchLogin } from "../fetch.js";

export const Login = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }


  const handleLogin = async (e) => {
    e.preventDefault();

    if (inputData.email === "" || inputData.password === "") {
      alert("Por favor completa todos los campos");
      return;
    }

    try{
      await fetchLogin(inputData);
      navigate("/");

    }catch (error) {
      console.error('Error al iniciar sesión:', error);
    }

  };

  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
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
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              name="password"
              value={inputData.password}
              onChange={handleInputChange}
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