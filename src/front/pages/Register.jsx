import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";



const Register = () => {
    const urlApi = `${import.meta.env.VITE_BACKEND_URL}/api`;
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
      [name]: value
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

        try {
            const response = await fetch(`${urlApi}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: inputData.username.trim(),
                    email: inputData.email.trim(),
                    password: inputData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Error en la solicitud');
            }

            const data = await response.json();
            console.log('Registro exitoso:', data);
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/login');
            return data;

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert(error.message || 'Ocurrió un error inesperado');
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