import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchRegister } from "../fetch";


const Register = () => {
    const navigate = useNavigate();
    
    const [inputData, setInputData] = useState({
        username: "",
        email: "",
        password: ""
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            inputData.username === "" ||
            inputData.email === "" ||
            inputData.password === ""
        ) {
            alert("Por favor completa todos los campos");
            return;
        }

        try{

            await fetchRegister(inputData);
            alert("Usuario registrado correctamente");
            navigate("/login");

        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    };

    return (
        <div className="bg-light d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "360px" }}>
                <h3 className="text-center mb-4">Registro de Usuario</h3>

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingresa tu usuario"
                            value={inputData.username}
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
                            value={inputData.email}
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
                            value={inputData.password}
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
