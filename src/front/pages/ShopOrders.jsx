
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    fetchStoreOrders,
    fetchUpdateOrderStatus,
} from "../fetch.js";

const ShopOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchStoreOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar las órdenes del negocio:", error);
            setError(
                error.message ||
                "No se pudieron cargar las órdenes del negocio"
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

    const handleStatusChange = async (orderId, nextStatus) => {
        try {
            setUpdatingOrderId(orderId);

            const updatedOrder = await fetchUpdateOrderStatus(orderId, nextStatus);

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId ? updatedOrder : order
                )
            );

            toast.success("Estado del pedido actualizado");
        } catch (error) {
            console.error("Error al actualizar el pedido:", error);
            toast.error(error.message || "No se pudo actualizar el pedido");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    return (
        <div className="ms-page">
            <div className="container">
                <div className="ms-page-shell">
                    <header className="ms-page-header">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                            <div>
                                <p className="ms-page-subtitle mb-1">
                                    Revisa y procesa pedidos de usuarios
                                </p>

                                <h1 className="ms-page-title">
                                    Órdenes del negocio
                                </h1>
                            </div>

                            <Link
                                to="/admin-shop"
                                className="btn btn-outline-light rounded-pill px-4"
                            >
                                <i className="fa-solid fa-arrow-left me-2" />
                                Volver al panel
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
                                        Cargando órdenes...
                                    </span>
                                </div>

                                <p className="text-muted mt-3 mb-0">
                                    Cargando órdenes...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger text-center" role="alert">
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
                                    No hay pedidos todavía
                                </h3>

                                <p className="text-muted mb-4">
                                    Cuando los usuarios compren, aparecerán aquí para procesarlos.
                                </p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {orders.map((order) => (
                                    <article
                                        key={order.id}
                                        className="store-product-card p-4"
                                    >
                                        <div className="row align-items-start">
                                            <div className="col-lg-3 mb-3 mb-lg-0">
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

                                                <p className="text-muted mb-1">
                                                    <i className="fa-regular fa-calendar me-2" />
                                                    {order.date}
                                                </p>

                                                <p className="mb-0">
                                                    <strong>Cliente:</strong> {order.user_name || "Usuario"}
                                                </p>

                                                <p className="mb-0 text-muted small">
                                                    {order.user_email || "Sin correo"}
                                                </p>
                                            </div>

                                            <div className="col-lg-3 mb-3 mb-lg-0">
                                                <p className="text-muted small mb-2">
                                                    Estado actual
                                                </p>

                                                <span
                                                    className={`badge rounded-pill px-3 py-2 ${getStatusClass(order.status)}`}
                                                >
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>

                                            <div className="col-lg-3 mb-3 mb-lg-0">
                                                <p className="text-muted small mb-2">
                                                    Total
                                                </p>

                                                <span
                                                    className="fs-4 fw-bold"
                                                    style={{ color: "var(--ms-green-dark)" }}
                                                >
                                                    ${Number(order.total_amount).toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="col-lg-3">
                                                <label className="form-label small text-muted">
                                                    Cambiar estado
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={order.status}
                                                    disabled={updatingOrderId === order.id}
                                                    onChange={(e) =>
                                                        handleStatusChange(order.id, e.target.value)
                                                    }
                                                >
                                                    <option value="pending">Pendiente</option>
                                                    <option value="completed">Completado</option>
                                                    <option value="cancelled">Cancelado</option>
                                                </select>

                                                {updatingOrderId === order.id && (
                                                    <small className="text-muted d-block mt-2">
                                                        Actualizando...
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-muted small mb-2">
                                                Productos incluidos
                                            </p>

                                            <div className="d-flex flex-column gap-2">
                                                {Array.isArray(order.order_items) && order.order_items.length > 0 ? (
                                                    order.order_items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2"
                                                        >
                                                            <div>
                                                                <strong>{item.product_name || "Producto"}</strong>
                                                                <div className="text-muted small">
                                                                    Cantidad: {item.quantity}
                                                                </div>
                                                            </div>

                                                            <span className="fw-semibold">
                                                                ${Number(item.subtotal || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-muted small">
                                                        Este pedido no tiene productos registrados.
                                                    </div>
                                                )}
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

export default ShopOrders;