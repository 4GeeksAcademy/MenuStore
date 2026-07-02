import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const CustomerHome = () => {
  const categories = ["general"];

  const [selectedCategory, setSelectedCategory] = useState("general");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem(selectedCategory);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-light bg-white shadow-sm px-4 justify-content-end">
        <Link to="/login" className="btn btn-outline-dark">
          Cerrar sesión
        </Link>
      </nav>

      <div className="container bg-white shadow rounded my-4 p-0">
        <div className="text-center py-5 px-3">
          <img
            src="https://placehold.co/200x150?text=Logo"
            alt="Logo"
            className="img-fluid rounded mb-3"
            style={{ width: "180px", height: "150px", objectFit: "cover" }}
          />

          <h1 className="fw-bold">Shop Name</h1>

          <p className="text-muted mb-0">
            Explora nuestros productos y servicios disponibles.
          </p>
        </div>

        <div className="bg-dark py-3 px-4 d-flex justify-content-center flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "btn btn-light text-capitalize"
                  : "btn btn-secondary text-capitalize"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="p-4">
          <h4 className="text-capitalize mb-4">
            {selectedCategory}
          </h4>

          {products.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">
                No hay productos disponibles en esta categoría.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="row align-items-center border rounded shadow-sm mb-3 p-3"
              >
                <div className="col-md-2">
                  <img
                    src={product.image || "https://placehold.co/200x150?text=Producto"}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ width: "200px", height: "130px", objectFit: "cover" }}
                  />
                </div>

                <div className="col-md-7">
                  <h5 className="fw-bold mb-2">{product.name}</h5>

                  <p className="text-muted mb-2">
                    {product.details}
                  </p>

                  <span className="fw-bold">
                    ${product.price}
                  </span>
                </div>

                <div className="col-md-3 text-md-end text-start mt-3 mt-md-0">
                  <div className="fs-4 mb-2">
                    <i className="fa-regular fa-star"></i>
                  </div>

                  <button className="btn btn-dark">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="bg-dark text-white text-center py-3 rounded-bottom">
          <small>
            © 2026 Shop Name - Todos los derechos reservados
          </small>
        </footer>
      </div>
    </div>
  );
};