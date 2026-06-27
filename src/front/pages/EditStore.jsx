import React, { useState } from "react";
import { Link } from "react-router-dom";

export const EditStore = () => {
  const [productImage, setProductImage] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDetails, setProductDetails] = useState("");

  const saveProduct = () => {
    const productData = {
      id: 1,
      image: productImage,
      name: productName,
      category: category,
      price: productPrice,
      details: productDetails
    };

    localStorage.setItem("productData", JSON.stringify(productData));
    alert("Producto guardado");
  };

  const deleteProduct = () => {
    setProductImage("");
    setProductName("");
    setCategory("");
    setProductPrice("");
    setProductDetails("");

    localStorage.removeItem("productData");
    alert("Producto eliminado");
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container bg-white shadow rounded p-4">

        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-dark px-4">
            UserName
          </button>
        </div>

        <div className="text-center mb-4">
          <img
            src={
              productImage
                ? productImage
                : "https://placehold.co/260x180?text=Product+Image"
            }
            alt="Product preview"
            className="img-fluid bg-secondary-subtle"
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

        <div className="border-top border-dark py-3">
          <select
            className="form-select w-25"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
            <option value="Services">Services</option>
            <option value="Products">Products</option>
            <option value="Other">Other</option>
          </select>
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

        <div className="border-top border-dark py-4">
          <div className="row">
            <div className="col-md-6 text-center">
              <button
                className="btn btn-secondary px-5 py-3 w-50"
                onClick={deleteProduct}
              >
                Delete
              </button>
            </div>

            <div className="col-md-6 text-center">
              <button
                className="btn btn-secondary px-5 py-3 w-50"
                onClick={saveProduct}
              >
                Save
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

