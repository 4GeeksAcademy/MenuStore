import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserOrders } from "../fetch.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchUserOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error al cargar los pedidos:",
        error
      );

      setError(
        error.message ||
          "No se pudieron cargar los pedidos"
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  return (
    <div className="ms-page">
      <div className="container">
        <div className="ms-page-shell">
          <header className="ms-page-header">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <p className="ms-page-subtitle mb-1">
                  Consulta tus compras anteriores
                </p>

                <h1 className="ms-page-title">
                  Mis pedidos
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
                    Cargando pedidos...
                  </span>
                </div>

                <p className="text-muted mt-3 mb-0">
                  Cargando tus pedidos...
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
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-solid fa-box-open mb-3"
                  style={{
                    color: "var(--ms-green)",
                    fontSize: "3.2rem",
                  }}
                />

                <h3
                  className="mb-2"
                  style={{
                    color: "var(--ms-navy)",
                  }}
                >
                  No tienes pedidos todavía
                </h3>

                <p className="text-muted mb-4">
                  Cuando realices una compra, aparecerá aquí.
                </p>

                <Link
                  to="/"
                  className="store-primary-button d-inline-block"
                >
                  <i className="fa-solid fa-store me-2" />
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="store-product-card p-4"
                  >
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <p className="text-muted small mb-1">
                          Número de pedido
                        </p>

                        <h4
                          className="mb-1"
                          style={{
                            color: "var(--ms-navy)",
                            fontWeight: 800,
                          }}
                        >
                          Pedido #{order.id}
                        </h4>

                        <p className="text-muted mb-0">
                          <i className="fa-regular fa-calendar me-2" />
                          {order.date}
                        </p>
                      </div>

                      <div className="col-md-3 mt-3 mt-md-0">
                        <p className="text-muted small mb-2">
                          Estado
                        </p>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="col-md-3 mt-3 mt-md-0">
                        <p className="text-muted small mb-1">
                          Total
                        </p>

                        <span
                          className="fs-4 fw-bold"
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

                      <div className="col-md-3 text-md-end mt-3 mt-md-0">
                        <Link
                          to={`/orders/${order.id}`}
                          className="store-primary-button d-inline-block"
                        >
                          Ver detalle
                          <i className="fa-solid fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;