import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const StorePreview = () => {
  const categories = ["comida", "bebidas", "servicios", "productos", "otros"];

  const [selectedCategory, setSelectedCategory] = useState("comida");
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
    <div className="bg-light min-vh-100 py-4">
      <div className="container bg-white shadow rounded p-0">

        <div className="text-center py-4">
          <img
            src="https://placehold.co/200x150?text=Logo"
            alt="Logo"
            className="img-fluid"
            style={{ width: "180px", height: "150px", objectFit: "cover" }}
          />

          <h2 className="mt-3 fw-bold">Shop Name</h2>
        </div>

        <div className="bg-dark py-3 px-4 d-flex justify-content-around flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "btn btn-light"
                  : "btn btn-secondary"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-capitalize">
              Categoría: {selectedCategory}
            </h4>

            <Link
              to={`/editStore/${selectedCategory}`}
              className="btn btn-dark"
            >
              Editar categoría
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-muted text-center">
              No hay productos en esta categoría.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="row align-items-center border-bottom py-4"
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
                  <h5 className="fw-bold">{product.name}</h5>
                  <ul>
                    <li>{product.details}</li>
                    <li>${product.price}</li>
                  </ul>
                </div>

                <div className="col-md-3 text-end">
                  <div className="fs-4">
                    <i className="fa-regular fa-star"></i>
                  </div>

                  <button className="btn btn-dark">
                    Buy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};