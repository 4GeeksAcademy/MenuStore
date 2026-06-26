import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom"

export const Login = () => {
	const { store, dispatch } = useGlobalReducer();

	return (
		<div className="bg-light d-flex justify-content-center align-items-center vh-100">
			<div className="card shadow p-4" style={{ width: "350px" }}>
				<h3 className="text-center mb-4">Iniciar Sesión</h3>

				<form>
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

					<div className="text-center mt-3">
						<span className="text-muted">
							¿No estás registrado?{" "}
						</span>

						<Link to={"/register"} className="text-decorartion-none fw-semibold">
							Regístrate aquí
						</Link> 
					
					</div>

				</form>
			</div>
		</div>
	);
};