import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShopAdminView = () => {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // 

  useEffect(() => {
    getStore();
    getCategories();
  }, []);

  const getStore = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/store`);
    const data = await response.json();

    if (response.ok) {
      setShopName(data.name || "");
    }
  };

  const getCategories = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
    const data = await response.json();

    if (response.ok) {
      setCategories(data);

      if (data.length > 0) {     
        setSelectedCategoryId(data[0].id);
      }  
    }  
  };

  const saveShopName = async () => {
    if (!shopName.trim()) {
      alert("Escribe el nombre de la tienda");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/store`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": shopName
      })
    });

    if (response.ok) {
      alert("Nombre guardado correctamente");
    }
  };

  const addCategory = async () => {
    console.log("Botón añadir presionado");
    console.log("categoryName:", categoryName);

    
    if (!categoryName.trim()) {
      alert("Escribe una categoría");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": categoryName.toLowerCase()
      })
    });

    const data = await response.json();

    if (response.ok) {
      setCategories([...categories, data]);
      setSelectedCategoryId(data.id);
      setCategoryName("");
      alert("Categoría agregada correctamente");
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategoryId) {
      alert("Selecciona una categoría");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/categories/${selectedCategoryId}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      const updatedCategories = categories.filter(
        (category) => category.id !== Number(selectedCategoryId)
      );

      setCategories(updatedCategories);

      if (updatedCategories.length > 0) {
        setSelectedCategoryId(updatedCategories[0].id);
      } else {
        setSelectedCategoryId("");
      }

      alert("Categoría eliminada correctamente");
    }
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark shadow-sm px-4 justify-content-between">
        <h5 className="text-white m-0">
          Admin Panel
        </h5>

        <button className="btn btn-outline-light" onClick={goBack}>
          Ir a tienda
        </button>
      </nav>

      <div className="container bg-white shadow rounded my-4 p-0">
        <div className="text-center py-5 px-3">
          <img
            src="https://placehold.co/200x150?text=Store"
            className="img-fluid rounded-4 shadow-sm mb-3"
            alt="Store storefront"
            style={{ width: "190px", height: "150px", objectFit: "cover" }}
          />

          <h1 className="fw-bold">
            Store Management
          </h1>

          <p className="text-muted mb-0">
            Administra la información principal de tu negocio.
          </p>
        </div>

        <div className="p-4">
          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-warning text-dark mb-2">
                Imagen
              </span>

              <h5 className="fw-bold mb-2">
                Imagen principal
              </h5>

              <p className="text-muted mb-0">
                Esta será la imagen visible para los clientes.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button type="button" className="btn btn-primary rounded-pill px-4">
                Edit Image
              </button>
            </div>
          </div>

          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-primary mb-2">
                Nombre
              </span>

              <h5 className="fw-bold mb-2">
                Nombre de la tienda
              </h5>

              <input
                type="text"
                className="form-control"
                placeholder="Name Shop"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={saveShopName}
              >
                Save Name
              </button>
            </div>
          </div>

          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-success mb-2">
                Categorías
              </span>

              <h5 className="fw-bold mb-2">
                Administrar categorías
              </h5>

              <div className="d-flex flex-wrap gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New category"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  style={{ maxWidth: "220px" }}
                />

                <select
                  className="form-select"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  style={{ maxWidth: "240px" }}
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={addCategory}
              >
                Añadir
              </button>

              <button
                type="button"
                className="btn btn-danger rounded-pill px-4"
                onClick={deleteCategory}
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="row align-items-center border rounded-4 shadow-sm mb-4 p-3 bg-white">
            <div className="col-md-8">
              <span className="badge bg-dark mb-2">
                Productos
              </span>

              <h5 className="fw-bold mb-2">
                Productos y servicios
              </h5>

              <p className="text-muted mb-0">
                Agrega, edita o elimina productos de la categoría seleccionada.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link
                to={
                  selectedCategoryId
                    ? `/product-manager/${selectedCategoryId}`
                    : "#"
                }
                className="btn btn-primary rounded-pill px-4"
                onClick={(e) => {
                  if (!selectedCategoryId) {
                    e.preventDefault();
                    alert("Selecciona una categoría primero");
                  }
                }}
              >
                Edit Products
              </Link>
            </div>
          </div>
        </div>

        <footer className="bg-dark text-white text-center py-3 rounded-bottom">
          <small>
            Panel administrativo - MenuStore
          </small>
        </footer>
      </div>
    </div>
  );
};

export default ShopAdminView;