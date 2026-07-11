import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const ProductManager = () => {
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDetails, setProductDetails] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, [categoryId]);

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/category/${categoryId}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudieron cargar los productos");
        setProducts([]);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("No se pudo conectar con el backend");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setProductName("");
    setProductImage("");
    setProductPrice("");
    setProductDetails("");
    setEditingId(null);
  };

  const saveProduct = async () => {
    if (!productName.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    if (productPrice === "" || Number(productPrice) < 0) {
      alert("Ingresa un precio válido");
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
      const url = editingId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/products/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/products`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo guardar el producto");
        return;
      }

      if (editingId) {
        setProducts(
          products.map((product) =>
            product.id === editingId ? data : product
          )
        );

        alert("Producto actualizado correctamente");
      } else {
        setProducts([...products, data]);
        alert("Producto guardado correctamente");
      }

      clearForm();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("No se pudo conectar con el backend");
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
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo eliminar el producto");
        return;
      }

      setProducts(
        products.filter((product) => product.id !== productId)
      );

      if (editingId === productId) {
        clearForm();
      }

      alert(data.message || "Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo conectar con el backend");
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

          <p className="text-muted mb-0">
            Categoría #{categoryId}
          </p>
        </div>

        <div className="p-4">
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
              <label className="form-label">
                URL de imagen
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="URL de la imagen"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
              />
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
              >
                {editingId ? "Actualizar" : "Guardar"}
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
                    Categoría #{categoryId}
                  </span>

                  <h5 className="fw-bold mb-1">
                    {product.name}
                  </h5>

                  <p className="text-muted mb-1">
                    {product.description ||
                      "Sin descripción"}
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