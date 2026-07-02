import { Link } from "react-router-dom";
import UseGlobalReducer from "../hooks/useGlobalReducer";


const ProductItem = () => {
    return <div className="row align-items-center border-bottom py-3 mx-0">
        <div className="col-md-2 text-center text-md-start">
            <img
                src="https://placehold.co"
                alt="Producto de prueba"
                className="img-fluid rounded"
                style={{ width: "120px", height: "90px", objectFit: "cover" }}
            />
        </div>

        <div className="col-md-4 mt-2 mt-md-0">
            <h5>Producto de Ejemplo</h5>
            <p className="text-muted small mb-0">Descripción breve del producto seleccionado.</p>
        </div>

        <div className="col-md-3 mt-2 mt-md-0 d-flex justify-content-center align-items-center gap-2">
            <button className="btn btn-outline-dark btn-sm px-2">-</button>
            <span className="fs-5 px-2 fw-semibold">1</span>
            <button className="btn btn-outline-dark btn-sm px-2">+</button>
        </div>

        <div className="col-md-3 mt-2 mt-md-0 text-center text-md-end">
            <span className="fs-5 fw-bold d-block mb-1">$99.99</span>
            <button className="btn btn-outline-danger btn-sm">Eliminar</button>
        </div>
    </div>
}
const ShoppingCart = () => {

    const { store } = UseGlobalReducer();

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
                    {store.cartItems.map((item) => (
                        <ProductItem key={item.id} />
                    ))}
                </div>

                <div className="row justify-content-end mt-4">
                    <div className="col-md-4 text-end">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <span className="fs-5 text-muted">Total:</span>
                            <span className="fs-3 fw-bold">$99.99</span>
                        </div>

                        <div className="d-flex justify-content-end gap-3">
                            <button className="btn btn-secondary px-4 py-2">
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