import React from "react";

export const StorePreview = () => {
    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container bg-white shadow rounded p-0">

                <div className="text-center py-4">
                    <div
                        className="bg-secondary-subtle mx-auto d-flex justify-content-center align-items-center"
                        style={{ width: "180px", height: "150px" }}
                    >
                        <span className="text-muted">Logo</span>
                    </div>

                    <h2 className="mt-3 fw-bold">Shop Name</h2>
                </div>

                <div className="bg-dark py-3 px-4 d-flex justify-content-around flex-wrap gap-2">
                    <button className="btn btn-secondary">Category</button>
                    <button className="btn btn-secondary">Category</button>
                    <button className="btn btn-secondary">Category</button>
                    <button className="btn btn-secondary">Category</button>
                    <button className="btn btn-secondary">Category</button>
                </div>

                <div className="p-4">

                    <div className="row align-items-center border-bottom py-4">
                        <div className="col-md-2">
                            <div
                                className="bg-secondary-subtle d-flex justify-content-center align-items-center"
                                style={{ height: "130px" }}
                            >
                                <img
                                    src="https://placehold.co/200x150?text=Producto"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </div>

                        <div className="col-md-7">
                            <h5 className="fw-bold">Producto ejemplo</h5>
                            <ul>
                                <li>Descripción del producto</li>
                                <li>Ingredientes o detalles</li>
                                <li>Precio o información extra</li>
                            </ul>
                        </div>

                        <div className="col-md-3 text-end">
                            <div className="fs-4">
                                <i className="fa-regular fa-star"></i>
                            </div>
                            <button className="btn btn-dark">Buy</button>
                        </div>
                    </div>

                    <div className="row align-items-center border-bottom py-4">
                        <div className="col-md-2">
                            <div
                                className="bg-secondary-subtle d-flex justify-content-center align-items-center"
                                style={{ height: "130px" }}
                            >
                                <img
                                    src="https://placehold.co/200x150?text=Producto"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </div>

                        <div className="col-md-7">
                            <h5 className="fw-bold">Producto ejemplo</h5>
                            <ul>
                                <li>Descripción del producto</li>
                                <li>Ingredientes o detalles</li>
                                <li>Precio o información extra</li>
                            </ul>
                        </div>

                        <div className="col-md-3 text-end">
                            <div className="fs-4">
                                <i className="fa-regular fa-star"></i>
                            </div>
                            <button className="btn btn-dark">Buy</button>
                        </div>
                    </div>

                    <div className="row align-items-center border-bottom py-4">
                        <div className="col-md-2">
                            <div
                                className="bg-secondary-subtle d-flex justify-content-center align-items-center"
                                style={{ height: "130px" }}
                            >
                                <img
                                    src="https://placehold.co/200x150?text=Producto"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </div>

                        <div className="col-md-7">
                            <h5 className="fw-bold">Producto ejemplo</h5>
                            <ul>
                                <li>Descripción del producto</li>
                                <li>Ingredientes o detalles</li>
                                <li>Precio o información extra</li>
                            </ul>
                        </div>

                        <div className="col-md-3 text-end">
                            <div className="fs-4">
                                <i className="fa-regular fa-star"></i>
                            </div>
                            <button className="btn btn-dark">Buy</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};