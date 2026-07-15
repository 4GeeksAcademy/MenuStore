import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetail } from "../fetch.js";

const OrderDetail = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchOrderDetail(orderId);

      setOrder(data);
    } catch (error) {
      console.error(
        "Error al cargar el pedido:",
        error
      );

      setError(
        error.message ||
          "No se pudo cargar el pedido"
      );

      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pendiente",
      completed: "Completado",
      cancelled: "Cancelado",
    };

    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-success";
    }

    if (status === "cancelled") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  if (loading) {
    return (
      <div className="ms-page d-flex align-items-center justify-content-center">
        <div className="text-center">
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
              Cargando pedido...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Cargando detalle del pedido...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="ms-page">
        <div className="container">
          <div
            className="ms-page-shell mx-auto"
            style={{ maxWidth: "700px" }}
          >
            <div className="ms-content-section text-center">
              <i
                className="fa-solid fa-circle-exclamation mb-3"
                style={{
                  color: "#b44343",
                  fontSize: "3rem",
                }}
              />

              <div className="alert alert-danger">
                {error ||
                  "No se pudo cargar el pedido"}
              </div>

              <Link
                to="/orders"
                className="store-primary-button d-inline-block"
              >
                Volver a mis pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderItems = Array.isArray(order.order_items)
    ? order.order_items
    : [];

  return (
    <div className="ms-page">
      <div className="container">
        <div className="ms-page-shell">
          <header className="ms-page-header">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <p className="ms-page-subtitle mb-1">
                  Detalle de tu compra
                </p>

                <h1 className="ms-page-title">
                  Pedido #{order.id}
                </h1>

                <p className="ms-page-subtitle mb-0 mt-2">
                  <i className="fa-regular fa-calendar me-2" />
                  {order.date}
                </p>
              </div>

              <Link
                to="/orders"
                className="btn btn-outline-light rounded-pill px-4"
              >
                <i className="fa-solid fa-arrow-left me-2" />
                Volver
              </Link>
            </div>
          </header>

          <div className="ms-content-section">
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="ms-cart-summary h-100">
                  <p className="text-muted mb-2">
                    Estado del pedido
                  </p>

                  <span
                    className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="ms-cart-summary h-100 text-md-end">
                  <p className="text-muted mb-1">
                    Total del pedido
                  </p>

                  <span
                    className="fs-2 fw-bold"
                    style={{
                      color:
                        "var(--ms-green-dark)",
                    }}
                  >
                    $
                    {Number(
                      order.total_amount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="store-product-card overflow-hidden">
              <div
                className="px-4 py-3"
                style={{
                  backgroundColor:
                    "var(--ms-navy)",
                  color: "#ffffff",
                }}
              >
                <h4 className="mb-0">
                  <i className="fa-solid fa-bag-shopping me-2" />
                  Productos del pedido
                </h4>
              </div>

              <div>
                {orderItems.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">
                      Este pedido no tiene productos registrados.
                    </p>
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div
                      className="ms-cart-item row align-items-center mx-0 px-3"
                      key={item.id}
                    >
                      <div className="col-md-2 text-center text-md-start">
                        <img
                          src={
                            item.product_image ||
                            "https://placehold.co/120x90"
                          }
                          alt={
                            item.product_name ||
                            "Producto"
                          }
                          className="ms-cart-image"
                        />
                      </div>

                      <div className="col-md-4 mt-3 mt-md-0">
                        <h5 className="ms-cart-product-name mb-2">
                          {item.product_name ||
                            "Producto"}
                        </h5>

                        <p className="text-muted mb-0">
                          Precio unitario:{" "}
                          <strong>
                            $
                            {Number(
                              item.historic_price
                            ).toFixed(2)}
                          </strong>
                        </p>
                      </div>

                      <div className="col-md-3 text-center mt-3 mt-md-0">
                        <span className="text-muted d-block mb-1">
                          Cantidad
                        </span>

                        <span
                          className="fs-5 fw-bold"
                          style={{
                            color: "var(--ms-navy)",
                          }}
                        >
                          {item.quantity}
                        </span>
                      </div>

                      <div className="col-md-3 text-center text-md-end mt-3 mt-md-0">
                        <span className="text-muted d-block mb-1">
                          Subtotal
                        </span>

                        <span className="ms-cart-price">
                          $
                          {Number(
                            item.subtotal
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <Link
                to="/orders"
                className="btn ms-secondary-button"
              >
                <i className="fa-solid fa-list me-2" />
                Ver todos mis pedidos
              </Link>

              <Link
                to="/"
                className="store-primary-button"
              >
                <i className="fa-solid fa-store me-2" />
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;