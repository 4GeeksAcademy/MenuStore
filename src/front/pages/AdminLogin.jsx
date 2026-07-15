
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLogin } from "../fetch.js";

export const AdminLogin = () => {
    const navigate = useNavigate();

    const [inputData, setInputData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setInputData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!inputData.email.trim() || !inputData.password.trim()) {
            alert("Por favor completa todos los campos");
            return;
        }

        try {
            const data = await fetchLogin({
                email: inputData.email.trim(),
                password: inputData.password,
            });

            if (data.user?.role !== "admin") {
                alert("Estas credenciales no pertenecen a una cuenta de administrador");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            navigate("/admin-shop");
        } catch (error) {
            console.error("Error al iniciar sesión como administrador:", error);
            alert(error.message || "Correo o contraseña incorrectos");
        }
    };

    return (
        <div className="bg-light d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "360px" }}>
                <h3 className="text-center mb-2">Acceso administrativo</h3>

                <p className="text-center text-muted mb-4">
                    Inicia sesión para administrar tu tienda
                </p>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Ingresa tu correo administrativo"
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
                        Ingresar como administrador
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-decoration-none text-secondary">
                            Volver al login de clientes
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
