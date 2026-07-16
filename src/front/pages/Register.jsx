import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchRegister } from "../fetch.js";

const Register = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [inputData, setInputData] = useState({
    name: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !inputData.name.trim() ||
      !inputData.email.trim() ||
      !inputData.password.trim()
    ) {
      toast.warn("Por favor completa todos los campos");
      return;
    }

    if (inputData.password.length < 6) {
      toast.warn("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setIsSubmitting(true);

      await fetchRegister({
        name: inputData.name.trim(),
        email: inputData.email.trim().toLowerCase(),
        password: inputData.password
      });

      toast.success("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      toast.error(
        error.message ||
        "No se pudo registrar el usuario"
      );
    } finally {

      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ width: "360px" }}
      >
        <h3 className="text-center mb-4">
          Registro de Usuario
        </h3>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">
              Nombre
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu nombre"
              value={inputData.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Correo Electrónico
            </label>

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
            <label className="form-label">
              Contraseña
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Crea una contraseña"
              value={inputData.password}
              onChange={handleInputChange}
              name="password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            Registrarse
          </button>

          <div className="text-center mt-4">
            <span className="text-muted">
              ¿Ya estás registrado?{" "}
            </span>

            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;