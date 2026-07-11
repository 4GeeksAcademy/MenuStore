import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchRegister } from "../fetch";


const Register = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("");
    const [inputValues, setInputValues] = useState({
        username: "",
        email: "",
        password: "",
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if (selectedRole === "") {
            alert("Selecciona si eres cliente o administrador");
            return;
        }
        if (
            inputValues.username === "" ||
            inputValues.email === "" ||
            inputValues.password === ""
        ) {
            alert("Por favor completa todos los campos");
            return;
        }

        fetchRegister(inputValues);

        navigate("/login");
    };

    return (
        <div className="bg-light d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "360px" }}>
                <h3 className="text-center mb-4">Registro de Usuario</h3>

                <form onSubmit={handleRegister}>
                    <p className="fw-semibold mb-2">¿Cómo deseas registrarte?</p>
                    <div className="d-flex gap-2 mb-4">
                        <button
                            type="button"
                            className={`btn w-50 ${selectedRole === "client" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSelectedRole("client")}
                        >
                            Cliente
                        </button>

                        <button
                            type="button"
                            className={`btn w-50 ${selectedRole === "admin" ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => setSelectedRole("admin")}
                        >
                            Administrador
                        </button>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingresa tu usuario"
                            value={inputValues.username}
                            onChange={handleInputChange}
                            name="username"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Ingresa tu correo"
                            value={inputValues.email}
                            onChange={handleInputChange}
                            name="email"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Crea una contraseña"
                            value={inputValues.password}
                            onChange={handleInputChange}
                            name="password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Registrarse
                    </button>

                    <div className="text-center mt-4">
                        <span className="text-muted">¿Ya estás registrado? </span>
                        <Link to="/login" className="text-decoration-none fw-semibold">
                            Inicia sesión aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
