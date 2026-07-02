import { Link } from "react-router-dom"; // agregue esto yisselle ver comentarios de abajo en edit products

const ShopAdminView = () => {

    return (
        <div className="container">
            <div className="card text-center shadow-sm">
                <div className="card-header fw-bold text-secondary">
                    Store Management View
                </div>

                <div className="card-body">
                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <img
                                src="https://unsplash.com"
                                className="img-fluid rounded border shadow-sm"
                                alt="Store storefront"
                            />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Edit Image</button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <input type="text" className="form-control" placeholder="Name Shop" />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Save Name</button>
                        </div>
                    </div>

                    <div className="row border-bottom py-4 mb-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <div className="btn-group">
                                <button type="button" className="btn btn-primary p-0">
                                    <input type="text" className="form-control form-control-sm border-0 bg-transparent text-white" placeholder="Category" />
                                </button>
                                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><div className="dropdown-item">Able Categories</div></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-secondary">Añadir Categories</button>
                        </div>
                    </div>

                    <div className="row py-4 justify-content-between align-items-center">
                        <div className="col-auto">
                            <button type="button" className="btn btn-primary">Products</button>
                        </div>
                        <div className="col-auto">
                            <Link
                                to="/product-manager/general" // cambie edit products 
                                className="btn btn-secondary" // solamente esta parte para que lleve a mi pestana de editar Product
                            >
                                Edit Products
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="card-footer text-body-secondary d-flex justify-content-center py-4">
                    <button type="button" className="btn btn-secondary px-5 py-3">Back</button>
                </div>
            </div>
        </div>
    )
}

export default ShopAdminView