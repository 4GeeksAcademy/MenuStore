import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {toast} from 'react-toastify'

import MiniUser from "./MiniUser";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

import {
  fetchStore,
  fetchCategories,
  fetchProductsByCategory,
  fetchUserFavorites,
  fetchAddFavorite,
  fetchDeleteFavorite,
  fetchAddToCart,
  fetchUserCart,
} from "../fetch.js";



export const CustomerHome = () => {
  const { dispatch } = useGlobalReducer();

  const {isActive, setIsActive} = useState(false)

  // Usuario guardado en localStorage
  const savedUser = localStorage.getItem("user");

  let loggedUser = null;

  try {
    loggedUser = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch (error) {
    console.error(
      "Error al leer el usuario guardado:",
      error
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const userId = loggedUser?.id;

  // Información general de la tienda
  const [shopName, setShopName] =
    useState("MenuStore");
  const [shopLogo, setShopLogo] = useState("");
  const [shopDescription, setShopDescription] =
    useState(
      "Explora nuestros productos y servicios disponibles."
    );

  // Categorías y productos
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState(null);
  const [products, setProducts] = useState([]);

  // Favoritos
  const [favoriteIds, setFavoriteIds] =
    useState([]);
  const [favoriteProducts, setFavoriteProducts] =
    useState([]);

  // Estados visuales
  const [loadingStore, setLoadingStore] =
    useState(true);
  const [loadingProducts, setLoadingProducts] =
    useState(false);
  const [error, setError] = useState("");

  // Cargar información de la tienda
  const getStore = async () => {
    try {
      setLoadingStore(true);
      setError("");

      const data = await fetchStore();

      setShopName(data.name || "MenuStore");
      setShopLogo(data.logo || "");

      setShopDescription(
        data.description ||
          "Explora nuestros productos y servicios disponibles."
      );
    } catch (error) {
      console.error(
        "Error al cargar la tienda:",
        error
      );

      setError(
        error.message ||
          "No se pudo cargar la información de la tienda."
      );
    } finally {
      setLoadingStore(false);
    }
  };

  // Cargar categorías
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
      console.error(
        "Error al cargar categorías:",
        error
      );

      setCategories([]);
      setSelectedCategory(null);
      setProducts([]);

      setError(
        error.message ||
          "No se pudieron cargar las categorías."
      );
    }
  };

  // Cargar productos de una categoría
  const getProductsByCategory = async (
    categoryId
  ) => {
    try {
      setLoadingProducts(true);
      setError("");

      const data =
        await fetchProductsByCategory(categoryId);

      if (!Array.isArray(data)) {
        throw new Error(
          "La respuesta de productos no tiene el formato esperado."
        );
      }

      setProducts(data);
    } catch (error) {
      console.error(
        "Error al cargar productos:",
        error
      );

      setProducts([]);

      setError(
        error.message ||
          "No se pudieron cargar los productos."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // Cargar favoritos del usuario
  const getFavorites = async () => {
    if (!userId) {
      setFavoriteIds([]);
      setFavoriteProducts([]);

      dispatch({
        type: "SET_FAVORITES",
        payload: [],
      });

      return;
    }

    try {
      const data =
        await fetchUserFavorites(userId);

      if (!Array.isArray(data)) {
        setFavoriteIds([]);
        setFavoriteProducts([]);

        dispatch({
          type: "SET_FAVORITES",
          payload: [],
        });

        return;
      }

      const ids = data
        .map(
          (favorite) => favorite.product_id
        )
        .filter(
          (productId) =>
            productId !== undefined &&
            productId !== null
        );

      setFavoriteIds(ids);
      setFavoriteProducts(data);

      dispatch({
        type: "SET_FAVORITES",
        payload: data,
      });
    } catch (error) {
      console.error(
        "Error al cargar favoritos:",
        error
      );

      setFavoriteIds([]);
      setFavoriteProducts([]);

      dispatch({
        type: "SET_FAVORITES",
        payload: [],
      });
    }
  };

  // Sincronizar carrito con el store global
  const syncCart = async () => {
    if (!userId) {
      dispatch({
        type: "CLEAR_CART",
      });

      return;
    }

    try {
      const data = await fetchUserCart(userId);

      dispatch({
        type: "SET_CART_ITEMS",
        payload: data.cart_items || [],
      });
    } catch (error) {
      console.error(
        "Error al sincronizar el carrito:",
        error
      );

      dispatch({
        type: "CLEAR_CART",
      });
    }
  };

  // Agregar o quitar favorito
  const toggleFavorite = async (productId) => {
    if (!userId) {
      alert(
        "Debes iniciar sesión para usar favoritos"
      );
      return;
    }

    const productIsFavorite =
      favoriteIds.includes(productId);

    try {
      if (productIsFavorite) {
        await fetchDeleteFavorite(
          userId,
          productId
        );

        setFavoriteIds((currentIds) =>
          currentIds.filter(
            (id) => id !== productId
          )
        );

        setFavoriteProducts(
          (currentFavorites) =>
            currentFavorites.filter(
              (favorite) =>
                favorite.product_id !==
                productId
            )
        );

        dispatch({
          type: "REMOVE_FAVORITE",
          payload: productId,
        });
      } else {
        await fetchAddFavorite(
          userId,
          productId
        );

        // Volvemos a cargar para obtener
        // toda la información del favorito
        await getFavorites();
      }
    } catch (error) {
      console.error(
        "Error al modificar favoritos:",
        error
      );

      alert(
        error.message ||
          "No se pudo modificar el favorito"
      );
    }
  };

  // Agregar producto al carrito
  const addToCart = async (productId) => {
    if (!userId) {
      alert(
        "Debes iniciar sesión para agregar productos al carrito"
      );
      return;
    }

    try {
      await fetchAddToCart(productId);

      // Actualiza inmediatamente el contador
      // del carrito en MiniUser
      await syncCart();

      toast.success("¡Agregado correctamente!");

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

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setFavoriteIds([]);
    setFavoriteProducts([]);

    dispatch({
      type: "LOGOUT",
    });
  };

  // Bajar suavemente hasta los productos
  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  // Cargar tienda y categorías una sola vez
  useEffect(() => {
    getStore();
    getCategories();
  }, []);

  // Sincronizar datos relacionados con el usuario
  useEffect(() => {
    if (userId) {
      getFavorites();
      syncCart();
    } else {
      setFavoriteIds([]);
      setFavoriteProducts([]);

      dispatch({
        type: "SET_FAVORITES",
        payload: [],
      });

      dispatch({
        type: "CLEAR_CART",
      });
    }
  }, [userId]);

  // Cargar productos al cambiar de categoría
  useEffect(() => {
    if (selectedCategory?.id) {
      getProductsByCategory(
        selectedCategory.id
      );
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  return (
    <div className="store-page">
      <nav className="navbar store-navbar px-3 px-md-4 py-3">
        <div className="container-fluid">
          <Link
            to="/"
            className="navbar-brand store-navbar-brand"
          >
            {shopName}
          </Link>

          <div className="ms-auto d-flex align-items-center gap-2 gap-md-3">
            <MiniUser
              favorites={favoriteProducts}
              onRemoveFavorite={toggleFavorite}
            />

            <Link
              to="/login"
              className="btn btn-outline-light store-logout-button"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket me-md-2" />

              <span className="d-none d-md-inline">
                Cerrar sesión
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5">
        <div className="store-shell">
          <section className="store-hero px-4 px-lg-5 py-5">
            {loadingStore ? (
              <div className="w-100 text-center py-5">
                <div
                  className="spinner-border"
                  role="status"
                  style={{
                    color: "var(--ms-navy)",
                    width: "3rem",
                    height: "3rem",
                  }}
                >
                  <span className="visually-hidden">
                    Cargando tienda...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Preparando la tienda...
                </p>
              </div>
            ) : (
              <div className="row align-items-center w-100">
                <div className="col-lg-6">
                  <span className="store-eyebrow mb-3">
                    <i className="fa-solid fa-leaf" />
                  </span>

                  <h1 className="store-title mb-4">
                    Sabores que
                    <br />
                    te encantarán
                  </h1>

                  <p className="store-description mb-4">
                    {shopDescription}
                  </p>

                  <button
                    type="button"
                    className="store-primary-button"
                    onClick={scrollToProducts}
                  >
                    Explorar menú

                    <i className="fa-solid fa-arrow-down ms-2" />
                  </button>
                </div>

                <div className="col-lg-6">
                  <div className="store-logo-frame">
                    <img
                      src={
                        shopLogo ||
                        "https://placehold.co/700x550?text=Tu+tienda"
                      }
                      alt={`Imagen de ${shopName}`}
                      className="store-logo"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="store-categories px-3 px-lg-5 py-4">
            <div className="d-flex justify-content-center flex-wrap gap-2 gap-md-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={
                    selectedCategory?.id ===
                    category.id
                      ? "store-category-button active"
                      : "store-category-button"
                  }
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  <span className="store-category-icon">
                    <i className="fa-solid fa-bowl-food" />
                  </span>

                  <span className="d-block">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section
            id="products-section"
            className="px-3 px-lg-5 py-5"
          >
            {error && (
              <div
                className="alert alert-danger text-center"
                role="alert"
              >
                <i className="fa-solid fa-circle-exclamation me-2" />
                {error}
              </div>
            )}

            <div className="d-flex align-items-end justify-content-between mb-4">
              <div>
                <p className="text-muted small mb-1">
                  Selección especial
                </p>

                <h2 className="store-section-title text-capitalize mb-0">
                  {selectedCategory
                    ? selectedCategory.name
                    : "Productos"}
                </h2>
              </div>

              {selectedCategory && (
                <span className="store-count-badge">
                  {products.length} productos
                </span>
              )}
            </div>

            {categories.length === 0 &&
            !error ? (
              <div className="text-center py-5">
                <i className="fa-solid fa-layer-group store-empty-icon mb-3" />

                <p className="text-muted mb-0">
                  Todavía no hay categorías disponibles.
                </p>
              </div>
            ) : loadingProducts ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  role="status"
                  style={{
                    color: "var(--ms-navy)",
                  }}
                >
                  <span className="visually-hidden">
                    Cargando productos...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Cargando productos...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-solid fa-plate-wheat store-empty-icon mb-3" />

                <p className="text-muted mb-0">
                  No hay productos disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {products.map((product) => (
                  <div
                    className="col-md-6 col-xl-4"
                    key={product.id}
                  >
                    <article className="store-product-card h-100">
                      <div className="store-product-image-wrapper">
                        <img
                          src={
                            product.image ||
                            "https://placehold.co/500x350?text=Producto"
                          }
                          alt={product.name}
                          className="store-product-image"
                        />
                      </div>

                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                          <span className="store-product-category">
                            {
                              selectedCategory?.name
                            }
                          </span>

                          <button
                            type="button"
                            className="store-favorite-button flex-shrink-0"
                            onClick={() =>
                              toggleFavorite(
                                product.id
                              )
                              
                            }
                            title={
                              favoriteIds.includes(
                                product.id
                              )
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                            }
                            aria-label={
                              favoriteIds.includes(
                                product.id
                              )
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                            }
                          >
                            <i
                              className={
                                favoriteIds.includes(
                                  product.id
                                )
                                  ? "fa-solid fa-star"
                                  : "fa-regular fa-star"
                              }
                            />
                          </button>
                        </div>

                        <h3 className="store-product-name">
                          {product.name}
                        </h3>

                        <p className="store-product-description">
                          {product.description ||
                            "Sin descripción"}
                        </p>

                        <div className="d-flex align-items-center justify-content-between gap-3 mt-4">
                          <span className="store-product-price">
                            $
                            {Number(
                              product.price
                            ).toFixed(2)}
                          </span>

                          <button
                            type="button"
                            className="store-cart-button"
                            onClick={() =>
                              addToCart(product.id)
                            }
                          >
                            <i className="fa-solid fa-cart-plus me-2" />
                            Agregar
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="store-footer text-center px-3 py-4">
            <small>
              © 2026 {shopName}. Todos los derechos reservados.
            </small>
          </footer>
        </div>
      </main>
    </div>
  );
};