import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const EditStore = () => {
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
    <div className="bg-light min-vh-100 py-4">
      <div className="container bg-white shadow rounded p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/storePreview" className="btn btn-outline-dark">
            Volver
          </Link>

          <button className="btn btn-dark">UserName</button>
        </div>

        <h2 className="text-center text-capitalize mb-4">
          Editar categoría: {categoryName}
        </h2>

        <div className="text-center mb-4">
          <img
            src={productImage || "https://placehold.co/260x180?text=Product+Image"}
            alt="Product preview"
            className="img-fluid"
            style={{ width: "260px", height: "180px", objectFit: "cover" }}
          />
        </div>

        <div className="border-top border-dark py-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Product Image URL"
            value={productImage}
            onChange={(e) => setProductImage(e.target.value)}
          />
        </div>

        <div className="border-top border-dark py-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="border-top border-dark py-3 d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />

          <span className="fs-4 fw-bold">$</span>
        </div>

        <div className="border-top border-dark py-3">
          <textarea
            className="form-control text-center"
            rows="3"
            placeholder="Details"
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
          ></textarea>
        </div>

        <div className="border-top border-dark py-4 d-flex justify-content-center gap-3">
          <button
            className="btn btn-secondary px-5 py-3"
            onClick={clearForm}
          >
            Cancel
          </button>

          <button
            className="btn btn-dark px-5 py-3"
            onClick={saveProduct}
          >
            {editingId ? "Update" : "Save"}
          </button>
        </div>

        <hr />

        <h4 className="mb-3">Productos guardados</h4>

        {products.length === 0 ? (
          <p className="text-muted">
            Todavía no hay productos en esta categoría.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="row align-items-center border-bottom py-3"
            >
              <div className="col-md-2">
                <img
                  src={product.image || "https://placehold.co/120x90?text=Product"}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ width: "120px", height: "90px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-6">
                <h5>{product.name}</h5>
                <p className="mb-1">{product.details}</p>
                <strong>${product.price}</strong>
              </div>

              <div className="col-md-4 text-end">
                <button
                  className="btn btn-warning me-2"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};