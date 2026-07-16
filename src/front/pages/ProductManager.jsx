import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  fetchProductsByCategory,
  fetchCreateProduct,
  fetchUpdateProduct,
  fetchDeleteProduct,
  fetchUploadImage,
  fetchCategories,
} from "../fetch.js";

export const ProductManager = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDetails, setProductDetails] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCategoryName, setCurrentCategoryName] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      getProducts(categoryId);
      getCategoryName(categoryId);
    }
  }, [categoryId]);

  const getCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategories([]);
      toast.error(error.message || "No se pudieron cargar las categorías");
    }
  };

  const getCategoryName = async (nextCategoryId = categoryId) => {
    try {
      const selectedCategory = categories.find(
        (category) => String(category.id) === String(nextCategoryId)
      );

      setCurrentCategoryName(selectedCategory?.name || "Categoría");
    } catch (error) {
      console.error("Error al cargar la categoría:", error);
      setCurrentCategoryName("Categoría");
      toast.error(error.message || "No se pudo cargar la categoría");
    }
  };

  const getProducts = async (nextCategoryId = categoryId) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const data = await fetchProductsByCategory(nextCategoryId);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setProducts([]);
      toast.error(error.message || "No se pudieron cargar los productos");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const clearForm = () => {
    setProductName("");
    setProductImage("");
    setProductPrice("");
    setProductDetails("");
    setEditingId(null);
  };

  const handleCategoryChange = (nextCategoryId, nextCategoryName) => {
    if (!nextCategoryId) {
      return;
    }

    setCurrentCategoryName(nextCategoryName || "Categoría");
    setProducts([]);
    setLoading(true);
    navigate(`/product-manager/${nextCategoryId}`);
  };

  const uploadProductImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const imageUrl = await fetchUploadImage(file);

      setProductImage(imageUrl);
      toast.success("Imagen cargada correctamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);

      toast.error(
        error.message ||
        "No se pudo subir la imagen"
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const saveProduct = async () => {
    if (!productName.trim()) {
      toast.warn("El nombre del producto es obligatorio");
      return;
    }

    if (productPrice === "" || Number(productPrice) < 0) {
      toast.warn("Ingresa un precio válido");
      return;
    }

    const productData = {
      name: productName.trim(),
      image: productImage.trim(),
      price: Number(productPrice),
      description: productDetails.trim(),
      category_id: Number(categoryId)
    };

    try {
      if (editingId) {
        const updatedProduct = await fetchUpdateProduct(
          editingId,
          productData
        );

        setProducts(
          products.map((product) =>
            product.id === editingId
              ? updatedProduct
              : product
          )
        );

        toast.success("Producto actualizado correctamente");
      } else {
        const newProduct = await fetchCreateProduct(productData);

        setProducts([...products, newProduct]);

        toast.success("Producto guardado correctamente");
      }

      clearForm();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast.error(error.message || "No se pudo guardar el producto");
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setProductName(product.name || "");
    setProductImage(product.image || "");
    setProductPrice(String(product.price ?? ""));
    setProductDetails(product.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );

    if (!confirmed) return;

    try {
      const data = await fetchDeleteProduct(productId);

      setProducts(
        products.filter((product) => product.id !== productId)
      );

      if (editingId === productId) {
        clearForm();
      }

      toast.success(
        data.message || "Producto eliminado correctamente"
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error(error.message || "No se pudo eliminar el producto");
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
            src={
              productImage ||
              "https://placehold.co/220x160?text=Product"
            }
            alt="Vista previa del producto"
            className="img-fluid rounded-4 shadow-sm mb-3"
            style={{
              width: "220px",
              height: "160px",
              objectFit: "cover"
            }}
          />

          <h1 className="fw-bold">
            Administrar productos
          </h1>
        </div>

        <div className="p-4">
          <div className="row g-3 mb-4">
            {categories.length > 0 ? (
              categories.map((item) => {
                const isActive = String(item.id) === String(categoryId);

                return (
                  <div key={item.id} className="col-md-4 col-lg-3">
                    <button
                      type="button"
                      className={`w-100 border rounded-4 shadow-sm p-3 text-start ${isActive ? "bg-dark text-white" : "bg-white"}`}
                      onClick={() => handleCategoryChange(item.id, item.name)}
                    >
                      <span className={`badge ${isActive ? "bg-light text-dark" : "bg-success"} mb-2`}>
                        {isActive ? "Seleccionada" : "Categoría"}
                      </span>

                      <h6 className="fw-bold mb-1">
                        {item.name}
                      </h6>

                      <small className={isActive ? "text-white-50" : "text-muted"}>
                        Administrar productos
                      </small>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="border rounded-4 shadow-sm p-4 bg-white text-center text-muted">
                  No hay categorías disponibles todavía.
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-4 shadow-sm mb-4 p-4 bg-white">
            <span className="badge bg-dark mb-2">
              Producto
            </span>

            <h5 className="fw-bold mb-3">
              {editingId
                ? "Editar producto"
                : "Agregar nuevo producto"}
            </h5>

            <div className="mb-3">
              <span className="badge bg-dark mb-2">
                Categoría activa
              </span>

              <div className="border rounded-3 p-3 bg-light">
                <strong>{currentCategoryName || "Categoría"}</strong>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Imagen del producto
              </label>

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={uploadProductImage}
                disabled={uploadingImage}
              />

              {uploadingImage && (
                <small className="text-muted d-block mt-2">
                  Subiendo imagen...
                </small>
              )}

              {productImage && !uploadingImage && (
                <small className="text-success d-block mt-2">
                  Imagen cargada correctamente
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Nombre del producto
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Nombre del producto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Precio
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Descripción
              </label>

              <textarea
                className="form-control"
                rows="3"
                placeholder="Descripción del producto"
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={clearForm}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={saveProduct}
                disabled={uploadingImage}
              >
                {uploadingImage
                  ? "Subiendo..."
                  : editingId
                    ? "Actualizar"
                    : "Guardar"}
              </button>
            </div>
          </div>

          <h4 className="mb-3">
            Productos guardados
          </h4>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Cargando...
                </span>
              </div>
            </div>
          ) : products.length === 0 ? (
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
                    src={
                      product.image ||
                      "https://placehold.co/120x90?text=Product"
                    }
                    alt={product.name}
                    className="img-fluid rounded-4 shadow-sm"
                    style={{
                      width: "120px",
                      height: "90px",
                      objectFit: "cover"
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <span className="badge bg-success mb-2">
                    {currentCategoryName || "Categoría"}
                  </span>

                  <h5 className="fw-bold mb-1">
                    {product.name}
                  </h5>

                  <p className="text-muted mb-1">
                    {product.description || "Sin descripción"}
                  </p>

                  <strong className="text-success">
                    ${Number(product.price).toFixed(2)}
                  </strong>
                </div>

                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-4 me-2"
                    onClick={() => editProduct(product)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger rounded-pill px-4"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Eliminar
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