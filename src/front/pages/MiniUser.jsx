import { Link } from "react-router-dom";
import UseGlobalReducer from "../hooks/useGlobalReducer";

const MiniUser = ({
  favorites = [],
  onRemoveFavorite,
}) => {
  const { store } = UseGlobalReducer();

  return (
    <div className="dropdown">
      <button
        className="btn ms-user-button dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="fa-regular fa-user me-2" />

        {store.user?.name || "Usuario"}
      </button>

      <ul className="dropdown-menu dropdown-menu-end ms-user-dropdown">
        <li>
          <Link
            className="dropdown-item"
            to="/user-view"
          >
            <i className="fa-regular fa-user me-2" />
            Ver perfil
          </Link>
        </li>

        <li>
          <Link
            className="dropdown-item d-flex align-items-center justify-content-between"
            to="/shopping-cart"
          >
            <span>
              <i className="fa-solid fa-cart-shopping me-2" />
              Carrito
            </span>

            {store.cartItems?.length > 0 && (
              <span className="badge bg-primary rounded-pill">
                {store.cartItems.length}
              </span>
            )}
          </Link>
        </li>

        <li>
          <Link
            className="dropdown-item"
            to="/orders"
          >
            <i className="fa-solid fa-box me-2" />
            Mis pedidos
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <div className="dropdown-item-text d-flex justify-content-between align-items-center px-2">
            <span className="ms-dropdown-heading">
              Favoritos
            </span>

            <span className="badge ms-favorite-count rounded-pill">
              {favorites.length}
            </span>
          </div>
        </li>

        {favorites.length === 0 ? (
          <li>
            <div className="text-center py-4">
              <i
                className="fa-regular fa-star mb-2"
                style={{
                  color: "var(--ms-gold)",
                  fontSize: "1.8rem",
                }}
              />

              <p className="text-muted small mb-0">
                No tienes favoritos todavía.
              </p>
            </div>
          </li>
        ) : (
          favorites.map((favorite) => {
            const product =
              favorite.product || favorite;

            const productId =
              favorite.product_id ?? product.id;

            const productName =
              product.name ||
              favorite.product_name ||
              "Producto";

            const productImage =
              product.image ||
              favorite.product_image ||
              "https://placehold.co/60x60?text=Producto";

            const productPrice =
              product.price ??
              favorite.product_price;

            return (
              <li
                className="ms-favorite-row"
                key={favorite.id || productId}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={productImage}
                    alt={productName}
                    className="ms-favorite-thumbnail"
                  />

                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-bold text-truncate">
                      {productName}
                    </div>

                    {productPrice !== undefined && (
                      <small
                        style={{
                          color: "var(--ms-green-dark)",
                          fontWeight: 700,
                        }}
                      >
                        ${Number(productPrice).toFixed(2)}
                      </small>
                    )}
                  </div>

                  <button
                    type="button"
                    className="ms-remove-favorite"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      onRemoveFavorite?.(productId);
                    }}
                    title="Quitar de favoritos"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default MiniUser;