

const ShopAdminView = () => {

    return (
        <div className="container">
            <nav className="navbar navbar-expand bg-white border-bottom p-3">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="btn btn-secondary px-4 py-2 text-white">
                                    UserName
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>
            </nav>
            <div className="row border-bottom py-4">
                <div className="col-3 p-2">
                    <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvcmV8ZW58MHx8MHx8fDA%3D"
                        className="img-fluid rounded border shadow-sm" />
                </div>
                <div className="col-9 d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary mt-auto">Edit Image</button>
                </div>
            </div>
            <div className="row border-bottom py-4">
                <div className="col-3 p2">
                    <input type="text" placeholder="Name Shop" />
                </div>
                <div className="col-9 d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary mt-auto">Save Name</button>
                </div>
            </div>
            <div className="row border-bottom py-4">
                <div className="col-3 p2">
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary"><input className="" type="text"/></button>
                        <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                        </button>
                        <ul class="dropdown-menu">
                            <li><div className="dropdown-item">Able Categories</div></li>
                        </ul>
                    </div>
                </div>
                <div className="col-9 d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary mt-auto">Anadir  Categories</button>
                </div>
            </div>
            <div className="row border-bottom py-4">
                <div className="col-3 p2">
                    <button type="button" className="btn btn-primary">Products</button>
                </div>
                <div className="col-9 d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary mt-auto">Edit Products</button>
                </div>
            </div>
            <div className="row py-4">
                <div className="col d-flex justify-content-center align-items-center">
                    <button type="button" className="btn btn-secondary mt-auto p-3">Back</button>
                </div>
            </div>
        </div>
    )
}

export default ShopAdminView