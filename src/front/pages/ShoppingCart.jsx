import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  fetchUserCart,
  fetchUpdateCartQuantity,
  fetchClearCart,
  fetchCheckout,
} from "../fetch.js";

const ProductItem = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="ms-cart-item row align-items-center mx-0">
      <div className="col-md-2 text-center text-md-start">
        <img
          src={
            item.product.image ||
            "https://placehold.co/120x90"
          }
          alt={item.product.name}
          className="ms-cart-image"
        />
      </div>

      <div className="col-md-4 mt-3 mt-md-0">
        <h5 className="ms-cart-product-name mb-2">
          {item.product.name}
        </h5>

        <p className="ms-cart-description small mb-0">
          {item.product.description || "Sin descripción"}
        </p>
      </div>

      <div className="col-md-3 mt-3 mt-md-0 d-flex justify-content-center align-items-center gap-3">
        <button
          type="button"
          className="ms-quantity-button"
          onClick={() =>
            onQuantityChange(
              item.product.id,
              Math.max(1, item.quantity - 1)
            )
          }
          disabled={item.quantity === 1}
          aria-label={`Disminuir cantidad de ${item.product.name}`}
        >
          −
        </button>

        <span className="fs-5 fw-bold">
          {item.quantity}
        </span>

        <button
          type="button"
          className="ms-quantity-button"
          onClick={() =>
            onQuantityChange(
              item.product.id,
              item.quantity + 1
            )
          }
          aria-label={`Aumentar cantidad de ${item.product.name}`}
        >
          +
        </button>
      </div>

      <div className="col-md-3 mt-3 mt-md-0 text-center text-md-end">
        <span className="ms-cart-price d-block mb-2">
          $
          {(
            Number(item.product.price) *
            Number(item.quantity)
          ).toFixed(2)}
        </span>

        <button
          type="button"
          className="btn ms-danger-button btn-sm px-3"
          onClick={() =>
            onRemove(item.product.id)
          }
        >
          <i className="fa-regular fa-trash-can me-2" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] =
    useState(false);
  const [clearingCart, setClearingCart] =
    useState(false);

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

  const loadCart = async () => {
    if (!userId) {
      setError(
        "Debes iniciar sesión para ver el carrito"
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await fetchUserCart(userId);

      setCartItems(data.cart_items || []);
    } catch (error) {
      console.error(
        "Error al cargar el carrito:",
        error
      );

      setError(
        error.message ||
          "No se pudo cargar el carrito"
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (
    productId,
    newQuantity
  ) => {
    try {
      setError("");

      await fetchUpdateCartQuantity(
        productId,
        newQuantity
      );

      await loadCart();
    } catch (error) {
      console.error(
        "Error al actualizar cantidad:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar la cantidad"
      );
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setError("");

      await fetchUpdateCartQuantity(productId, 0);

      await loadCart();
    } catch (error) {
      console.error(
        "Error al eliminar producto:",
        error
      );

      setError(
        error.message ||
          "No se pudo eliminar el producto"
      );
    }
  };

  const handleClearCart = async () => {
    try {
      setClearingCart(true);
      setError("");

      await fetchClearCart();

      setCartItems([]);
    } catch (error) {
      console.error(
        "Error al vaciar el carrito:",
        error
      );

      setError(
        error.message ||
          "No se pudo vaciar el carrito"
      );
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    try {
      setProcessingPayment(true);
      setError("");

      const data = await fetchCheckout();

      setCartItems([]);

      navigate(
        `/order-success/${data.order.id}`,
        {
          state: {
            order: data.order,
          },
        }
      );
    } catch (error) {
      console.error(
        "Error al proceder al pago:",
        error
      );

      setError(
        error.message ||
          "No se pudo completar la compra"
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const total = cartItems.reduce(
    (accumulator, item) => {
      return (
        accumulator +
        Number(item.product.price) *
          Number(item.quantity)
      );
    },
    0
  );

  return (
    <div className="ms-page">
      <div className="container">
        <div className="ms-page-shell">
          <header className="ms-page-header">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <p className="ms-page-subtitle mb-1">
                  Revisa tu selección antes de comprar
                </p>

                <h1 className="ms-page-title">
                  Mi carrito
                </h1>
              </div>

              <Link
                to="/"
                className="btn btn-outline-light rounded-pill px-4"
              >
                <i className="fa-solid fa-arrow-left me-2" />
                Seguir comprando
              </Link>
            </div>
          </header>

          <div className="ms-content-section">
            {loading ? (
              <div className="text-center py-5">
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
                    Cargando carrito...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Cargando tu carrito...
                </p>
              </div>
            ) : error ? (
              <div
                className="alert alert-danger text-center"
                role="alert"
              >
                <i className="fa-solid fa-circle-exclamation me-2" />
                {error}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-solid fa-cart-shopping mb-3"
                  style={{
                    color: "var(--ms-green)",
                    fontSize: "3.3rem",
                  }}
                />

                <h3
                  className="mb-2"
                  style={{
                    color: "var(--ms-navy)",
                  }}
                >
                  Tu carrito está vacío
                </h3>

                <p className="text-muted mb-4">
                  Agrega algunos productos para comenzar tu compra.
                </p>

                <Link
                  to="/"
                  className="store-primary-button d-inline-block"
                >
                  <i className="fa-solid fa-store me-2" />
                  Explorar productos
                </Link>
              </div>
            ) : (
              <>
                <div>
                  {cartItems.map((item) => (
                    <ProductItem
                      key={item.id}
                      item={item}
                      onQuantityChange={
                        handleQuantityChange
                      }
                      onRemove={
                        handleRemoveItem
                      }
                    />
                  ))}
                </div>

                <div className="row justify-content-end mt-5">
                  <div className="col-lg-5 col-xl-4">
                    <div className="ms-cart-summary">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                        <span className="text-muted fs-5">
                          Total
                        </span>

                        <span
                          className="fs-2 fw-bold"
                          style={{
                            color:
                              "var(--ms-green-dark)",
                          }}
                        >
                          ${total.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-muted small mb-4">
                        El total incluye todos los productos y cantidades seleccionadas.
                      </p>

                      <div className="d-grid gap-3">
                        <button
                          type="button"
                          className="btn ms-secondary-button"
                          onClick={handleClearCart}
                          disabled={
                            clearingCart ||
                            processingPayment
                          }
                        >
                          {clearingCart ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                aria-hidden="true"
                              />
                              Vaciando...
                            </>
                          ) : (
                            <>
                              <i className="fa-regular fa-trash-can me-2" />
                              Vaciar carrito
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="ms-checkout-button"
                          onClick={handleCheckout}
                          disabled={
                            clearingCart ||
                            processingPayment
                          }
                        >
                          {processingPayment ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                aria-hidden="true"
                              />
                              Procesando...
                            </>
                          ) : (
                            <>
                              Proceder al pago
                              <i className="fa-solid fa-arrow-right ms-2" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;