import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()


	return (
		<div className="container mt-5 ">
			<div className="row">
				<img src="" alt="" />
			</div>
			<div className="row">
				hola
			</div>
			<div className="row">
				jaja
			</div>
		</div>
	);
}; 