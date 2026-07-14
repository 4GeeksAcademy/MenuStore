import { Link } from "react-router-dom";
import UseGlobalReducer from "../hooks/useGlobalReducer";

const MiniUser = () => {
    const {store} = UseGlobalReducer();

    return (
  <div className="dropdown">
    <button
      className="btn btn-outline-light dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {store.user?.name || "Usuario"}
    </button>

    <ul className="dropdown-menu dropdown-menu-end">
      <li>
        <Link className="dropdown-item" to="/user-view">
          Ver perfil
        </Link>
      </li>

      <li>
        <Link
          className="dropdown-item d-flex align-items-center justify-content-between"
          to="/shopping-cart"
        >
          <span>Carrito</span>

          {store.cartItems.length > 0 && (
            <span className="badge bg-primary ms-2">
              {store.cartItems.length}
            </span>
          )}
        </Link>
      </li>
    </ul>
  </div>
);
}

export default MiniUser