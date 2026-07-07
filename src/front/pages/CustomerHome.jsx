import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const CustomerHome = () => {


  const [shopName, setShopName] = useState("Shop Name");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    getStore();
    getCategories();
  }, []);

  const getStore = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/store`);
    const data = await response.json();

    if (response.ok) {
      setShopName(data.name || "Shop Name");
    }
  };

  const getCategories = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
    const data = await response.json();

    if (response.ok) {
      setCategories(data);

      if (data.length > 0) {
        setSelectedCategory(data[0]);
      }
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      getProductsByCategory();
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  const getProductsByCategory = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/category/${selectedCategory.id}`
    );

    const data = await response.json();

    if (response.ok) {
      setProducts(data);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} agregado al carrito`);
  };

  const rateProduct = (productId, rating) => {
  setRatings({
    ...ratings,
    [productId]: rating
  });
};



  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark shadow-sm px-4 justify-content-end">
        <Link to="/login" className="btn btn-light">
          Cerrar sesión
        </Link>
      </nav>

      <div className="container bg-white shadow rounded my-4 p-0">
        <div className="text-center py-5 px-3 bg-white">
          <img
            src="https://placehold.co/200x150?text=Logo"
            alt="Logo"
            className="img-fluid rounded-4 shadow-sm mb-3"
            style={{ width: "190px", height: "150px", objectFit: "cover" }}
          />

          <h1 className="fw-bold"> {shopName} </h1>

          <p className="text-muted mb-0">
            Explora nuestros productos y servicios disponibles.
          </p>
        </div>

        <div className="bg-dark py-3 px-4 d-flex justify-content-center flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={
                selectedCategory?.id === category.id
                  ? "btn btn-light border border-dark text-capitalize"
                  : "btn btn-light text-capitalize"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="p-4">
          <h4 className="text-capitalize mb-4">
            {selectedCategory ? selectedCategory.name : "Categorías"}
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
                className="product-card row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white"
              >
                <div className="col-md-2">
                  <img
                    src={product.image || "https://placehold.co/300x220?text=Producto"}
                    alt={product.name}
                    className="img-fluid rounded-4 shadow-sm"
                    style={{
                      width: "220px",
                      height: "150px",
                      objectFit: "cover"
                    }}
                  />
                </div>

                <div className="col-md-7">
                  <h5 className="fw-bold mb-2">{product.name}</h5>

                  <p className="text-muted mb-2">
                    {product.description}
                  </p>

                  <span className="fs-5 fw-bold text-success">
                    ${product.price}
                  </span>
                </div>

                <div className="col-md-3 text-md-end text-start mt-3 mt-md-0">
                  <div className="fs-5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={
                          star <= (ratings[product.id] || 0)
                            ? "fa-solid fa-star text-warning me-1"
                            : "fa-regular fa-star me-1"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => rateProduct(product.id, star)}
                      ></i>
                    ))}
                  </div>

                  <button className="btn btn-success rounded-pill px-4">
                    <i className="fa-solid fa-cart-plus me-2"></i>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="bg-dark text-white text-center py-3 rounded-bottom">
          <small>
            © 2026 {shopName} - Todos los derechos reservados
          </small>
        </footer>
      </div>
    </div>
  );
};