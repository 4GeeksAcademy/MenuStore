import { Link } from "react-router-dom"

const Register = () => {

    return (<div className="bg-light d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: "360px" }}>
            <h3 className="text-center mb-4">Registro de Usuario</h3>

            <form>
                <div className="mb-3">
                    <label className="form-label">Nombre de Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingresa tu usuario"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Ingresa tu correo"
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Crea una contraseña"
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
    )
}

export default Register