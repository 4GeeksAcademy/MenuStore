import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const CustomerHome = () => {
  const urlApi = `${import.meta.env.VITE_BACKEND_URL}/api`;

  // Datos generales de la tienda
  const [shopName, setShopName] = useState("Shop Name");
  const [shopLogo, setShopLogo] = useState("");
  const [shopDescription, setShopDescription] = useState(
    "Explora nuestros productos y servicios disponibles."
  );

  // Categorías y productos
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  // Favoritos temporales del frontend
  const [favorites, setFavorites] = useState([]);

  // Estados visuales
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");

  // Al abrir CustomerHome, carga la tienda y las categorías
  useEffect(() => {
    getStore();
    getCategories();
  }, []);

  // Cada vez que cambia la categoría seleccionada,
  // carga los productos correspondientes
  useEffect(() => {
    if (selectedCategory) {
      getProductsByCategory(selectedCategory.id);
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  const getStore = async () => {
    try {
      setLoadingStore(true);
      setError("");

      const response = await fetch(`${urlApi}/store`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Error al obtener la tienda"
        );
      }

      setShopName(data.name || "Shop Name");
      setShopLogo(data.logo || "");
      setShopDescription(
        data.description ||
        "Explora nuestros productos y servicios disponibles."
      );
    } catch (error) {
      console.error("Error al cargar la tienda:", error);

      setError(
        error.message ||
        "No se pudo cargar la información de la tienda."
      );
    } finally {
      setLoadingStore(false);
    }
  };

  const getCategories = async () => {
    try {
      setError("");

      const response = await fetch(`${urlApi}/categories`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Error al obtener las categorías"
        );
      }

      setCategories(data);

      if (data.length > 0) {
        setSelectedCategory(data[0]);
      } else {
        setSelectedCategory(null);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);

      setError(
        error.message ||
        "No se pudieron cargar las categorías."
      );
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      setLoadingProducts(true);
      setError("");

      const response = await fetch(`${urlApi}/products/category/${categoryId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener los productos");
      }

      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);

      setProducts([]);

      setError(
        error.message ||
        "No se pudieron cargar los productos."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const toggleFavorite = (productId) => {
    const productIsFavorite = favorites.includes(productId);

    if (productIsFavorite) {
      setFavorites(
        favorites.filter(
          (favoriteId) => favoriteId !== productId
        )
      );
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark shadow-sm px-4 justify-content-end">
        <Link to="/login" className="btn btn-light">
          Cerrar sesión
        </Link>
      </nav>

      <div className="container bg-white shadow rounded my-4 p-0">
        {/* Información principal de la tienda */}
        <div className="text-center py-5 px-3 bg-white">
          {loadingStore ? (
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Cargando tienda...
              </span>
            </div>
          ) : (
            <img
              src={
                shopLogo ||
                "https://placehold.co/200x150?text=Logo"
              }
              alt={`Logo de ${shopName}`}
              className="img-fluid rounded-4 shadow-sm mb-3"
              style={{
                width: "190px",
                height: "150px",
                objectFit: "cover"
              }}
            />
          )}

          <h1 className="fw-bold">
            {shopName}
          </h1>

          <p className="text-muted mb-0">
            {shopDescription}
          </p>
        </div>

        {/* Botones de categorías */}
        <div className="bg-dark py-3 px-4 d-flex justify-content-center flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={
                selectedCategory?.id === category.id
                  ? "btn btn-light border border-primary border-2 text-capitalize"
                  : "btn btn-light text-capitalize"
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="p-4">
          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          <h4 className="text-capitalize mb-4">
            {selectedCategory
              ? selectedCategory.name
              : "Categorías"}
          </h4>

          {categories.length === 0 && !error ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">
                Todavía no hay categorías disponibles.
              </p>
            </div>
          ) : loadingProducts ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Cargando productos...
                </span>
              </div>
            </div>
          ) : products.length === 0 ? (
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
                    src={
                      product.image ||
                      "https://placehold.co/300x220?text=Producto"
                    }
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
                  <span className="badge bg-success text-capitalize mb-2">
                    {selectedCategory?.name}
                  </span>

                  <h5 className="fw-bold mb-2">
                    {product.name}
                  </h5>

                  <p className="text-muted mb-2">
                    {product.description || "Sin descripción"}
                  </p>

                  <span className="fs-5 fw-bold text-success">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                <div className="col-md-3 text-md-end text-start mt-3 mt-md-0">
                  <div className="fs-6 mb-3">
                    <span className="me-2">
                      Añadir a favoritos
                    </span>

                    <i
                      className={
                        favorites.includes(product.id)
                          ? "fa-solid fa-star text-warning"
                          : "fa-regular fa-star"
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        toggleFavorite(product.id)
                      }
                      title={
                        favorites.includes(product.id)
                          ? "Quitar de favoritos"
                          : "Agregar a favoritos"
                      }
                    />
                  </div>

                  {/* Solo visual por ahora.
                      Después se conectará con el carrito. */}
                  <button
                    type="button"
                    className="btn btn-success rounded-pill px-4"
                  >
                    <i className="fa-solid fa-cart-plus me-2" />
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