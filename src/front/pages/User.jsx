import Link from "react-router-dom";

const User = () => {

    return (
        <div className="container">
            <nav className="navbar navbar-expand bg-white border-bottom p-3">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        UserName
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><div class="dropdown-item" ><Link to="/view-user">View User</Link></div></li>
                                        <li><div class="dropdown-item" ><Link to="/shopping-cart">Shopping Cart</Link></div></li>
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

export default User