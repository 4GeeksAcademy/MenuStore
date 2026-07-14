import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchUserCart,
    fetchUpdateCartQuantity,
    fetchClearCart
} from "../fetch.js";

const ProductItem = ({ item, onQuantityChange, onRemove }) => {


    return <div className="row align-items-center border-bottom py-3 mx-0">
        <div className="col-md-2 text-center text-md-start">
            <img
                src={
                    item.product.image ||
                    "https://placehold.co/120x90"
                }
                alt={item.product.name}
                className="img-fluid rounded"
                style={{ width: "120px", height: "90px", objectFit: "cover" }}
            />
        </div>

        <div className="col-md-4 mt-2 mt-md-0">
            <h5>{item.product.name}</h5>
            <p className="text-muted small mb-0">
                {item.product.description || "Sin descripción"}
            </p>
        </div>

        <div className="col-md-3 mt-2 mt-md-0 d-flex justify-content-center align-items-center gap-2">
            <button
                className="btn btn-outline-dark btn-sm px-2"
                onClick={() =>
                    onQuantityChange(
                        item.product.id,
                        Math.max(1, item.quantity - 1)
                    )
                }
                disabled={item.quantity === 1}
            >
                -
            </button>

            <span className="fs-5 px-2 fw-semibold">
                {item.quantity}
            </span>
            <button
                className="btn btn-outline-dark btn-sm px-2"
                onClick={() =>
                    onQuantityChange(
                        item.product.id,
                        item.quantity + 1
                    )
                }
            >
                +
            </button>
        </div>

        <div className="col-md-3 mt-2 mt-md-0 text-center text-md-end">
            <span className="fs-5 fw-bold d-block mb-1">
                ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </span>
            <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onRemove(item.product.id)}
            >
                Eliminar
            </button>
        </div>
    </div>

};
const ShoppingCart = () => {

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const savedUser = localStorage.getItem("user");
    const loggedUser = savedUser
        ? JSON.parse(savedUser)
        : null;

    const userId = loggedUser?.id;

    const loadCart = async () => {
        if (!userId) {
            setError("Debes iniciar sesión para ver el carrito");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await fetchUserCart(userId);

            setCartItems(data.cart_items || []);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);

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

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            setError("");

            await fetchUpdateCartQuantity(productId, newQuantity);

            await loadCart();
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);

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
            console.error("Error al eliminar producto:", error);

            setError(
                error.message ||
                "No se pudo eliminar el producto"
            );
        }
    };

    const total = cartItems.reduce((accumulator, item) => {
        return (
            accumulator +
            Number(item.product.price) * Number(item.quantity)
        );
    }, 0);

    const handleClearCart = async () => {
        try {
            setError("");

            await fetchClearCart();

            setCartItems([]);
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);

            setError(
                error.message ||
                "No se pudo vaciar el carrito"
            );
        }
    };


    return <div className="bg-light min-vh-100 py-4">
        <div className="container bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/" className="btn btn-outline-dark">
                    Seguir Comprando
                </Link>
            </div>

            <h2 className="text-center mb-4">Mi Carrito de Compras</h2>

            <div>
                <div className="border-top border-dark">

                    {loading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-success"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando carrito...
                                </span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger text-center">
                            {error}
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted mb-0">
                                Tu carrito está vacío.
                            </p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <ProductItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                            />
                        ))
                    )}

                </div>

                <div className="row justify-content-end mt-4">
                    <div className="col-md-4 text-end">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <span className="fs-5 text-muted">Total:</span>
                            <span className="fs-3 fw-bold">
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        <div className="d-flex justify-content-end gap-3">
                            <button
                                className="btn btn-secondary px-4 py-2"
                                onClick={handleClearCart}
                                disabled={cartItems.length === 0}
                            >
                                Vaciar Carrito
                            </button>
                            <button className="btn btn-dark px-4 py-2">
                                Proceder al Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default ShoppingCart;