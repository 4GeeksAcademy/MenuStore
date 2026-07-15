import { Link, useLocation, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  const totalAmount = order?.total_amount ?? 0;
  const orderNumber = order?.id ?? orderId;

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div
          className="card shadow-sm border-0 mx-auto"
          style={{ maxWidth: "650px" }}
        >
          <div className="card-body text-center p-5">
            <div className="mb-4">
              <i
                className="fa-solid fa-circle-check text-success"
                style={{ fontSize: "80px" }}
              />
            </div>

            <h1 className="fw-bold mb-3">
              ¡Gracias por tu compra!
            </h1>

            <p className="text-muted fs-5">
              Tu pedido fue creado correctamente.
            </p>

            <div className="bg-light rounded p-4 my-4">
              <div className="mb-3">
                <span className="text-muted d-block">
                  Número de orden
                </span>

                <span className="fs-3 fw-bold">
                  #{orderNumber}
                </span>
              </div>

              <div>
                <span className="text-muted d-block">
                  Total pagado
                </span>

                <span className="fs-2 fw-bold text-success">
                  ${Number(totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                to={`/orders/${orderNumber}`}
                className="btn btn-dark px-4"
              >
                Ver pedido
              </Link>

              <Link
                to="/orders"
                className="btn btn-outline-dark px-4"
              >
                Mis pedidos
              </Link>

              <Link
                to="/"
                className="btn btn-outline-success px-4"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;