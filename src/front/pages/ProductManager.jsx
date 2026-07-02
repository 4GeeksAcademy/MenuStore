import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const ProductManager = () => {
  const { categoryName } = useParams();

  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDetails, setProductDetails] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem(categoryName);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, [categoryName]);

  const clearForm = () => {
    setProductName("");
    setProductImage("");
    setProductPrice("");
    setProductDetails("");
    setEditingId(null);
  };

  const saveProduct = () => {
    if (!productName.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    const productData = {
      id: editingId || Date.now(),
      name: productName,
      image: productImage,
      price: productPrice,
      details: productDetails
    };

    let updatedProducts;

    if (editingId) {
      updatedProducts = products.map((product) =>
        product.id === editingId ? productData : product
      );
    } else {
      updatedProducts = [...products, productData];
    }

    setProducts(updatedProducts);
    localStorage.setItem(categoryName, JSON.stringify(updatedProducts));

    clearForm();

    alert(editingId ? "Producto actualizado" : "Producto guardado");
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setProductName(product.name);
    setProductImage(product.image);
    setProductPrice(product.price);
    setProductDetails(product.details);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    setProducts(updatedProducts);
    localStorage.setItem(categoryName, JSON.stringify(updatedProducts));

    if (editingId === productId) {
      clearForm();
    }
  };

  return (
    <div className="bg-light min-vh-100">
    <nav className="navbar navbar-dark bg-dark shadow-sm px-4 justify-content-between">
      <h5 className="text-white m-0">
        Product Manager
      </h5>

      <Link to="/admin-shop" className="btn btn-outline-light">
        Volver
      </Link>
    </nav>

    <div className="container bg-white shadow rounded my-4 p-0">
      <div className="text-center py-5 px-3">
        <img
          src={productImage || "https://placehold.co/220x160?text=Product"}
          alt="Product preview"
          className="img-fluid rounded-4 shadow-sm mb-3"
          style={{ width: "220px", height: "160px", objectFit: "cover" }}
        />

        <h1 className="fw-bold text-capitalize">
          {categoryName}
        </h1>

        <p className="text-muted mb-0">
          Agrega, edita o elimina productos de esta categoría.
        </p>
      </div>

      <div className="p-4">
        <div className="border rounded-4 shadow-sm mb-4 p-4 bg-white">
          <span className="badge bg-dark mb-2">
            Producto
          </span>

          <h5 className="fw-bold mb-3">
            {editingId ? "Editar producto" : "Agregar nuevo producto"}
          </h5>

          <div className="mb-3">
            <label className="form-label">URL de imagen</label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Image URL"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre del producto</label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="text"
              className="form-control"
              placeholder="Price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Detalles</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Details"
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-primary rounded-pill px-4"
              onClick={clearForm}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={saveProduct}
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        <h4 className="mb-3">
          Productos guardados
        </h4>

        {products.length === 0 ? (
          <div className="text-center py-5 border rounded-4">
            <p className="text-muted mb-0">
              Todavía no hay productos en esta categoría.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white"
            >
              <div className="col-md-2">
                <img
                  src={product.image || "https://placehold.co/120x90?text=Product"}
                  alt={product.name}
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ width: "120px", height: "90px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-6">
                <span className="badge bg-success mb-2 text-capitalize">
                  {categoryName}
                </span>

                <h5 className="fw-bold mb-1">
                  {product.name}
                </h5>

                <p className="text-muted mb-1">
                  {product.details}
                </p>

                <strong className="text-success">
                  ${product.price}
                </strong>
              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <button
                  className="btn btn-outline-primary rounded-pill px-4 me-2"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger rounded-pill px-4"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="bg-dark text-white text-center py-3 rounded-bottom">
        <small>
          Product Manager - MenuStore
        </small>
      </footer>
    </div>
  </div>
);

};