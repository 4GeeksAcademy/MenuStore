import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MiniUser from "./MiniUser"; // ver si funciona el dropdwon en el navbar

import {
  fetchStore,
  fetchCategories,
  fetchProductsByCategory,
  fetchUserFavorites,
  fetchAddFavorite,
  fetchDeleteFavorite,
  fetchAddToCart
} from "../fetch.js";

export const CustomerHome = () => {
  // Recuperar de forma segura al usuario que inició sesión
  const savedUser = localStorage.getItem("user");

  let loggedUser = null;

  try {
    loggedUser = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch (error) {
    console.error("Error al leer el usuario guardado:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const userId = loggedUser?.id;

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

  // Identificadores de los productos favoritos
  const [favorites, setFavorites] = useState([]);

  // Estados visuales
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");

  // Al abrir la página, carga la tienda y las categorías
  useEffect(() => {
    getStore();
    getCategories();
  }, []);

  // Cargar los favoritos del usuario
  useEffect(() => {
    if (userId) {
      getFavorites();
    } else {
      setFavorites([]);
    }
  }, [userId]);

  // Cargar productos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory?.id) {
      getProductsByCategory(selectedCategory.id);
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  const getStore = async () => {
    try {
      setLoadingStore(true);
      setError("");

      const data = await fetchStore();

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

      const data = await fetchCategories();

      if (!Array.isArray(data)) {
        throw new Error(
          "La respuesta de categorías no tiene el formato esperado."
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

      setCategories([]);
      setSelectedCategory(null);
      setProducts([]);

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

      const data = await fetchProductsByCategory(categoryId);

      if (!Array.isArray(data)) {
        throw new Error(
          "La respuesta de productos no tiene el formato esperado."
        );
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

  const getFavorites = async () => {
    try {
      const data = await fetchUserFavorites(userId);

      if (!Array.isArray(data)) {
        console.error(
          "La respuesta de favoritos no es una lista:",
          data
        );

        setFavorites([]);
        return;
      }

      const favoriteProductIds = data
        .map((favorite) => favorite.product_id)
        .filter((productId) => productId !== undefined);

      setFavorites(favoriteProductIds);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      setFavorites([]);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!userId) {
      alert("Debes iniciar sesión para usar favoritos");
      return;
    }

    const productIsFavorite = favorites.includes(productId);

    try {
      if (productIsFavorite) {
        await fetchDeleteFavorite(userId, productId);

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (favoriteId) => favoriteId !== productId
          )
        );
      } else {
        await fetchAddFavorite(userId, productId);

        setFavorites((currentFavorites) => [
          ...currentFavorites,
          productId
        ]);
      }
    } catch (error) {
      console.error("Error al modificar favoritos:", error);

      alert(
        error.message ||
        "No se pudo modificar el favorito"
      );
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert(
        "Debes iniciar sesión para agregar productos al carrito"
      );
      return;
    }

    try {
      await fetchAddToCart(productId);

      alert("Producto agregado al carrito correctamente");
    } catch (error) {
      console.error(
        "Error al agregar producto al carrito:",
        error
      );

      alert(
        error.message ||
        "No se pudo agregar el producto al carrito"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setFavorites([]);
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark shadow-sm px-4 py-2">
        <div className="ms-auto d-flex align-items-center gap-2">
          <MiniUser />

          <Link
            to="/login"
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Link>
        </div>
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

                  <button
                    type="button"
                    className="btn btn-success rounded-pill px-4"
                    onClick={() => addToCart(product.id)}
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