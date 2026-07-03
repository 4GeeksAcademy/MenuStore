import { Link } from "react-router-dom";
import UseGlobalReducer from "../hooks/useGlobalReducer";

const MiniUser = () => {
    const {store} = UseGlobalReducer();

    return (
        <div className="container">
            <nav className="navbar navbar-expand bg-white border-bottom p-3">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        UserName
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <div className="dropdown-item" >
                                                <Link to="/user-view">
                                                    View User
                                                </Link>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="dropdown-item d-flex align-items-center" >
                                                <Link to="/shopping-cart">
                                                    Shopping Cart
                                                </Link>
                                                <div>
                                                    {store.cartItems.length > 0 && (
                                                        <span className="badge bg-primary ms-2">{store.cartItems.length}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default MiniUser