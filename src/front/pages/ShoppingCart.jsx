import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

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
  isUpdating,
}) => {
  const productId = item.product.id;
  const productName = item.product.name;
  const quantity = Number(item.quantity);

  return (
    <div className="ms-cart-item row align-items-center mx-0">
      <div className="col-md-2 text-center text-md-start">
        <img
          src={
            item.product.image ||
            "https://placehold.co/120x90"
          }
          alt={productName}
          className="ms-cart-image"
        />
      </div>

      <div className="col-md-4 mt-3 mt-md-0">
        <h5 className="ms-cart-product-name mb-2">
          {productName}
        </h5>

        <p className="ms-cart-description small mb-0">
          {item.product.description ||
            "Sin descripción"}
        </p>
      </div>

      <div className="col-md-3 mt-3 mt-md-0 d-flex justify-content-center align-items-center gap-3">
        <button
          type="button"
          className="ms-quantity-button"
          onClick={() =>
            onQuantityChange(
              productId,
              Math.max(1, quantity - 1)
            )
          }
          disabled={
            quantity === 1 ||
            isUpdating
          }
          aria-label={`Disminuir cantidad de ${productName}`}
        >
          −
        </button>

        <span
          className="fs-5 fw-bold d-inline-flex justify-content-center align-items-center"
          style={{ minWidth: "30px" }}
        >
          {isUpdating ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-label="Actualizando cantidad"
            />
          ) : (
            quantity
          )}
        </span>

        <button
          type="button"
          className="ms-quantity-button"
          onClick={() =>
            onQuantityChange(
              productId,
              quantity + 1
            )
          }
          disabled={isUpdating}
          aria-label={`Aumentar cantidad de ${productName}`}
        >
          +
        </button>
      </div>

      <div className="col-md-3 mt-3 mt-md-0 text-center text-md-end">
        <span className="ms-cart-price d-block mb-2">
          $
          {(
            Number(item.product.price) *
            quantity
          ).toFixed(2)}
        </span>

        <button
          type="button"
          className="btn ms-danger-button btn-sm px-3"
          onClick={() => onRemove(productId)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Actualizando...
            </>
          ) : (
            <>
              <i className="fa-regular fa-trash-can me-2" />
              Eliminar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingPayment, setProcessingPayment] =
    useState(false);

  const [clearingCart, setClearingCart] =
    useState(false);

  const [updatingProductId, setUpdatingProductId] =
    useState(null);

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

      setCartItems([]);

      dispatch({
        type: "CLEAR_CART",
      });

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await fetchUserCart(userId);

      const receivedItems = Array.isArray(
        data.cart_items
      )
        ? data.cart_items
        : [];

      /*
       * Ordenamos una sola vez al cargar.
       * El ID de Cart_Items mantiene un orden estable.
       */
      const orderedItems = [...receivedItems].sort(
        (firstItem, secondItem) =>
          Number(firstItem.id) -
          Number(secondItem.id)
      );

      setCartItems(orderedItems);

      dispatch({
        type: "SET_CART_ITEMS",
        payload: orderedItems,
      });
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

      dispatch({
        type: "CLEAR_CART",
      });
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
    /*
     * Evita enviar dos solicitudes simultáneas
     * para el mismo producto.
     */
    if (updatingProductId === productId) {
      return;
    }

    try {
      setUpdatingProductId(productId);
      setError("");

      await fetchUpdateCartQuantity(
        productId,
        newQuantity
      );

      /*
       * Actualizamos únicamente el producto afectado.
       * Ya no llamamos loadCart(), por lo que los
       * productos no cambian de posición.
       */
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );

      dispatch({
        type: "UPDATE_CART_ITEM_QUANTITY",
        payload: {
          productId,
          quantity: newQuantity,
        },
      });
    } catch (error) {
      console.error(
        "Error al actualizar cantidad:",
        error
      );

      setError(
        error.message ||
          "No se pudo actualizar la cantidad"
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (updatingProductId === productId) {
      return;
    }

    try {
      setUpdatingProductId(productId);
      setError("");

      await fetchUpdateCartQuantity(
        productId,
        0
      );

      /*
       * Eliminamos únicamente el producto seleccionado.
       * No recargamos todo el carrito.
       */
      setCartItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.product.id !== productId
        )
      );

      dispatch({
        type: "REMOVE_CART_ITEM",
        payload: productId,
      });
    } catch (error) {
      console.error(
        "Error al eliminar producto:",
        error
      );

      setError(
        error.message ||
          "No se pudo eliminar el producto"
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleClearCart = async () => {
    if (
      clearingCart ||
      processingPayment ||
      updatingProductId !== null
    ) {
      return;
    }

    try {
      setClearingCart(true);
      setError("");

      await fetchClearCart();

      setCartItems([]);

      dispatch({
        type: "CLEAR_CART",
      });
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

    if (
      processingPayment ||
      clearingCart ||
      updatingProductId !== null
    ) {
      return;
    }

    try {
      setProcessingPayment(true);
      setError("");

      const data = await fetchCheckout();

      if (!data?.order?.id) {
        throw new Error(
          "El servidor no devolvió la orden creada"
        );
      }

      setCartItems([]);

      dispatch({
        type: "CLEAR_CART",
      });

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
    (accumulator, item) =>
      accumulator +
      Number(item.product.price) *
        Number(item.quantity),
    0
  );

  const cartIsBusy =
    clearingCart ||
    processingPayment ||
    updatingProductId !== null;

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
                      isUpdating={
                        updatingProductId ===
                        item.product.id
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
                          disabled={cartIsBusy}
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
                          disabled={cartIsBusy}
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